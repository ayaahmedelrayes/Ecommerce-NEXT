'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await register(form.name, form.email, form.phone, form.password)
      toast.success(data.message)
      router.push('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'خطأ في التسجيل')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'name',     label: 'الاسم الكامل',       type: 'text',     placeholder: 'اسمك الكامل' },
    { name: 'email',    label: 'البريد الإلكتروني',  type: 'email',    placeholder: 'your@email.com' },
    { name: 'phone',    label: 'رقم الهاتف (اختياري)', type: 'tel',   placeholder: '01xxxxxxxxx' },
    { name: 'password', label: 'كلمة المرور',         type: 'password', placeholder: '6 أحرف على الأقل' }
  ]

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">إنشاء حساب جديد</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                required={f.name !== 'phone'}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={f.placeholder} />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors">
            {loading ? 'جارٍ التسجيل...' : 'إنشاء حساب'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-4">
          عندك حساب؟{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">سجّل دخولك</Link>
        </p>
      </div>
    </div>
  )
}
