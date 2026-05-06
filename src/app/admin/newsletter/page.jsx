'use client'
import { useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { FiMail, FiSend } from 'react-icons/fi'

export default function AdminNewsletterPage() {
  const [form, setForm]     = useState({ subject: '', content: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSend = async e => {
    e.preventDefault()
    if (!form.subject || !form.content) return toast.error('الموضوع والمحتوى مطلوبين')
    if (!confirm(`هل أنت متأكد من إرسال النشرة لجميع المشتركين؟`)) return
    setLoading(true)
    try {
      const { data } = await api.put('/newsletter', form)
      toast.success(data.message)
      setForm({ subject: '', content: '' })
    } catch (err) {
      toast.error(err.response?.data?.error || 'حدث خطأ في الإرسال')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">إرسال نشرة بريدية</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6 p-3 bg-green-50 rounded-xl">
          <FiMail className="text-green-600" size={20} />
          <p className="text-green-700 text-sm">النشرة ستُرسل لجميع المشتركين النشطين في قائمة البريد</p>
        </div>

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">موضوع الإيميل *</label>
            <input name="subject" value={form.subject} onChange={handleChange} className={inputCls}
              placeholder="مثال: عروض هذا الأسبوع 🛍️" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">محتوى الإيميل (HTML مسموح) *</label>
            <textarea name="content" value={form.content} onChange={handleChange} rows={8}
              className={`${inputCls} resize-none font-mono`}
              placeholder={'<h2>مرحباً بكم! 👋</h2>\n<p>اكتشف أحدث عروضنا...</p>\n<a href="https://...">تسوق الآن</a>'}
              required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            <FiSend size={16} />
            {loading ? 'جارٍ الإرسال...' : 'إرسال النشرة'}
          </button>
        </form>
      </div>
    </div>
  )
}
