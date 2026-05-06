'use client'
import { useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function NewsletterForm() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/newsletter', { email })
      toast.success(data.message)
      setEmail('')
    } catch (err) {
      toast.error(err.response?.data?.error || 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-blue-600 text-white rounded-2xl p-8 text-center my-8">
      <h3 className="text-xl font-bold mb-1">اشترك في نشرتنا البريدية 📧</h3>
      <p className="text-blue-100 text-sm mb-5">احصل على أحدث العروض والمنتجات في بريدك</p>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
          placeholder="بريدك الإلكتروني"
          className="flex-1 px-4 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white" />
        <button type="submit" disabled={loading}
          className="bg-white text-blue-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 disabled:opacity-60 transition-colors whitespace-nowrap">
          {loading ? '...' : 'اشترك'}
        </button>
      </form>
    </div>
  )
}
