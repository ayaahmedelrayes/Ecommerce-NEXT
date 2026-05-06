'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi'

const emptyForm = { name: '', description: '', image: '' }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [modal,      setModal]      = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [form,       setForm]       = useState(emptyForm)

  useEffect(() => {
    api.get('/categories')
      .then(r => setCategories(r.data))
      .finally(() => setLoading(false))
  }, [])

  const openNew = () => { setForm(emptyForm); setModal(true) }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('اسم التصنيف مطلوب')
    setSaving(true)
    try {
      const { data } = await api.post('/categories', {
        name:        form.name.trim(),
        description: form.description.trim(),
        image:       form.image.trim() || null
      })
      setCategories(prev => [...prev, data])
      toast.success('تمت إضافة التصنيف ✅')
      setModal(false)
    } catch (err) {
      toast.error(err.response?.data?.error || 'حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`هل أنت متأكد من حذف تصنيف "${name}"؟\nسيتم حذفه فقط إذا لم يكن مرتبطاً بمنتجات.`)) return
    try {
      await api.delete(`/categories/${id}`)
      setCategories(prev => prev.filter(c => c._id !== id))
      toast.success('تم حذف التصنيف')
    } catch (err) {
      toast.error(err.response?.data?.error || 'حدث خطأ في الحذف')
    }
  }

  const inputCls = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">التصنيفات</h1>
        <button onClick={openNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center gap-2 transition-colors">
          <FiPlus size={16} /> تصنيف جديد
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-36 animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center text-gray-400">
          <div className="text-5xl mb-3">🗂️</div>
          <p className="text-lg font-medium mb-1">ما فيش تصنيفات</p>
          <p className="text-sm">اضغط "تصنيف جديد" لإضافة أول تصنيف</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div key={cat._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
              {/* صورة التصنيف */}
              <div className="relative h-28 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🗂️</div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-800 truncate">{cat.name}</h3>
                {cat.description && (
                  <p className="text-gray-400 text-xs mt-0.5 truncate">{cat.description}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded">
                    /{cat.slug}
                  </span>
                  <button onClick={() => handleDelete(cat._id, cat.name)}
                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal إضافة تصنيف */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">تصنيف جديد</h2>
              <button onClick={() => setModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">اسم التصنيف *</label>
                <input name="name" value={form.name} onChange={handleChange}
                  className={inputCls} placeholder="مثال: إلكترونيات" autoFocus />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">الوصف (اختياري)</label>
                <input name="description" value={form.description} onChange={handleChange}
                  className={inputCls} placeholder="وصف مختصر للتصنيف" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">رابط الصورة (اختياري)</label>
                <input name="image" value={form.image} onChange={handleChange}
                  className={inputCls} placeholder="https://example.com/image.jpg" />
              </div>

              {/* معاينة الصورة */}
              {form.image && (
                <div className="relative h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                  <Image src={form.image} alt="معاينة" fill className="object-cover"
                    onError={e => { e.target.style.display = 'none' }} />
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors">
                {saving ? 'جارٍ الحفظ...' : 'إضافة التصنيف'}
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
