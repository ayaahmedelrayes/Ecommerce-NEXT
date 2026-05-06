'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'

const emptyForm = { name: '', description: '', price: '', comparePrice: '', stock: '', category: '', images: '' }

export default function AdminProductsPage() {
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [modal,      setModal]      = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [editSlug,   setEditSlug]   = useState(null)
  const [form,       setForm]       = useState(emptyForm)

  useEffect(() => {
    Promise.all([api.get('/admin/products'), api.get('/categories')])
      .then(([p, c]) => { setProducts(p.data); setCategories(c.data) })
      .finally(() => setLoading(false))
  }, [])

  const openNew = () => {
    setEditSlug(null)
    setForm(emptyForm)
    setModal(true)
  }

  const openEdit = (p) => {
    setEditSlug(p.slug)
    setForm({
      name:         p.name,
      description:  p.description || '',
      price:        p.price,
      comparePrice: p.comparePrice || '',
      stock:        p.stock,
      category:     p.category?._id || '',
      images:       (p.images || []).join(', ')
    })
    setModal(true)
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    if (!form.name || form.price === '' || form.stock === '' || !form.category) {
      return toast.error('الاسم والسعر والمخزون والتصنيف مطلوبين')
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        price:        Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
        stock:        Number(form.stock),
        images:       form.images.split(',').map(s => s.trim()).filter(Boolean)
      }

      if (editSlug) {
        const { data } = await api.put(`/products/${editSlug}`, payload)
        setProducts(prev => prev.map(p => p.slug === editSlug ? data : p))
        toast.success('تم تعديل المنتج ✅')
      } else {
        const { data } = await api.post('/products', payload)
        setProducts(prev => [data, ...prev])
        toast.success('تمت إضافة المنتج ✅')
      }
      setModal(false)
    } catch (err) {
      toast.error(err.response?.data?.error || 'حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (slug) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return
    try {
      await api.delete(`/products/${slug}`)
      setProducts(prev => prev.filter(p => p.slug !== slug))
      toast.success('تم حذف المنتج')
    } catch {
      toast.error('حدث خطأ')
    }
  }

  const inputCls = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">المنتجات</h1>
        <button onClick={openNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center gap-2 transition-colors">
          <FiPlus size={16} /> منتج جديد
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['', 'الاسم', 'السعر', 'المخزون', 'التصنيف', 'الحالة', 'إجراء'].map(h => (
                  <th key={h} className="text-right px-4 py-3 text-gray-500 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-2">📦</div>
                    <p>ما فيش منتجات</p>
                  </td>
                </tr>
              ) : products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {p.images?.[0]
                        ? <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-xs">
                    <p className="truncate">{p.name}</p>
                  </td>
                  <td className="px-4 py-3 text-blue-600 font-semibold whitespace-nowrap">{p.price} ج.م</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {p.stock} قطعة
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${p.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                      {p.isActive ? 'نشط' : 'محذوف'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعديل">
                        <FiEdit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(p.slug)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal إضافة / تعديل */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editSlug ? 'تعديل منتج' : 'منتج جديد'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">اسم المنتج *</label>
                <input name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="اسم المنتج" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">السعر (ج.م) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} min="0" className={inputCls} placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">سعر الشطب</label>
                  <input name="comparePrice" type="number" value={form.comparePrice} onChange={handleChange} min="0" className={inputCls} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">المخزون (قطعة) *</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} min="0" className={inputCls} placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">التصنيف *</label>
                <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                  <option value="">اختر تصنيف</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">روابط الصور (مفصولة بفاصلة)</label>
                <input name="images" value={form.images} onChange={handleChange} className={inputCls} placeholder="https://example.com/img1.jpg, https://..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">الوصف</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} placeholder="وصف المنتج..." />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors">
                {saving ? 'جارٍ الحفظ...' : editSlug ? 'حفظ التعديلات' : 'إضافة المنتج'}
              </button>
              <button onClick={() => setModal(false)}
                className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
