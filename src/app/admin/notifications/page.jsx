'use client'
import { useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { FiBell, FiSend } from 'react-icons/fi'

export default function AdminNotificationsPage() {
  const [form, setForm]     = useState({ title: '', body: '', url: '/' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSend = async e => {
    e.preventDefault()
    if (!form.title || !form.body) return toast.error('العنوان والنص مطلوبين')
    setLoading(true)
    try {
      const { data } = await api.post('/notifications/send', form)
      toast.success(data.message)
      setForm({ title: '', body: '', url: '/' })
    } catch (err) {
      toast.error(err.response?.data?.error || 'حدث خطأ في الإرسال')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">إرسال إشعار Push</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6 p-3 bg-blue-50 rounded-xl">
          <FiBell className="text-blue-600" size={20} />
          <p className="text-blue-700 text-sm">الإشعار سيُرسل لجميع المستخدمين المشتركين في الإشعارات</p>
        </div>

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">عنوان الإشعار *</label>
            <input name="title" value={form.title} onChange={handleChange} className={inputCls}
              placeholder="مثال: عرض خاص 🎉" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">نص الإشعار *</label>
            <textarea name="body" value={form.body} onChange={handleChange} rows={3}
              className={`${inputCls} resize-none`}
              placeholder="مثال: خصم 20% على جميع المنتجات اليوم فقط!" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">رابط عند الضغط</label>
            <input name="url" value={form.url} onChange={handleChange} className={inputCls}
              placeholder="/products" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            <FiSend size={16} />
            {loading ? 'جارٍ الإرسال...' : 'إرسال الإشعار'}
          </button>
        </form>
      </div>
    </div>
  )
}
