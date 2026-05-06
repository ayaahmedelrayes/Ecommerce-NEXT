'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { FiCreditCard, FiDollarSign } from 'react-icons/fi'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, getTotal, clearCart } = useCartStore()
  const total = getTotal()

  const [loading, setLoading]       = useState(false)
  const [paymentMethod, setPayment] = useState('STRIPE')
  const [form, setForm] = useState({
    fullName:   user?.name || '',
    address:    '',
    city:       '',
    phone:      user?.phone || '',
    guestEmail: ''
  })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!items.length) return toast.error('السلة فارغة')
    setLoading(true)
    try {
      // إنشاء الطلب
      const { data: order } = await api.post('/orders', {
        items:           items.map(i => ({ id: i.id, quantity: i.quantity, name: i.name })),
        paymentMethod,
        shippingAddress: { fullName: form.fullName, address: form.address, city: form.city, phone: form.phone },
        guestEmail:      !user ? form.guestEmail : null
      })

      if (paymentMethod === 'STRIPE') {
        const { data: payData } = await api.post('/payment/stripe', {
          items:      items.map(i => ({ id: i.id, quantity: i.quantity })),
          orderId:    order._id,
          guestEmail: !user ? form.guestEmail : null
        })
        clearCart()
        window.location.href = payData.url

      } else {
        clearCart()
        router.push(`/checkout/success?order_id=${order._id}&method=cash`)
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'حدث خطأ أثناء الطلب')
    } finally {
      setLoading(false)
    }
  }

  if (!items.length) return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center gap-4 text-gray-400">
      <div className="text-5xl">🛒</div>
      <p className="text-lg">السلة فارغة</p>
      <Link href="/products" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700">تسوق الآن</Link>
    </div>
  )

  const inputCls = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">إتمام الشراء</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-6">

        <div className="space-y-4">
          {/* بيانات الشحن */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">بيانات الشحن</h2>
            {!user && (
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">البريد الإلكتروني</label>
                <input type="email" name="guestEmail" value={form.guestEmail} onChange={handleChange} required className={inputCls} placeholder="your@email.com" />
              </div>
            )}
            {[
              { name: 'fullName', label: 'الاسم الكامل', placeholder: 'اسمك الكامل',   type: 'text' },
              { name: 'address',  label: 'العنوان',      placeholder: 'الشارع والرقم',  type: 'text' },
              { name: 'city',     label: 'المدينة',      placeholder: 'القاهرة',        type: 'text' },
              { name: 'phone',    label: 'رقم الهاتف',   placeholder: '01xxxxxxxxx',    type: 'tel'  }
            ].map(f => (
              <div key={f.name} className="mb-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} required className={inputCls} placeholder={f.placeholder} />
              </div>
            ))}
          </div>

          {/* طريقة الدفع */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">طريقة الدفع</h2>
            <div className="space-y-2">
              {[
                { value: 'STRIPE', label: 'بطاقة ائتمان (Stripe)', icon: <FiCreditCard size={18} /> },
                { value: 'CASH',   label: 'الدفع عند الاستلام',    icon: <FiDollarSign size={18} /> }
              ].map(opt => (
                <label key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors
                    ${paymentMethod === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" value={opt.value} checked={paymentMethod === opt.value}
                    onChange={e => setPayment(e.target.value)} className="hidden" />
                  <span className={paymentMethod === opt.value ? 'text-blue-600' : 'text-gray-400'}>{opt.icon}</span>
                  <span className="font-medium text-gray-700 text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ملخص الطلب */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="font-bold text-gray-800 mb-4">ملخص الطلب</h2>
          <div className="space-y-2 mb-4">
            {items.map(i => (
              <div key={i.id} className="flex justify-between text-sm text-gray-500">
                <span className="truncate ml-2">{i.name} × {i.quantity}</span>
                <span className="flex-shrink-0">{(i.price * i.quantity).toFixed(0)} ج.م</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-800 text-xl mb-6">
            <span>الإجمالي</span>
            <span className="text-blue-600">{total.toFixed(0)} ج.م</span>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-60 transition-colors text-lg">
            {loading ? 'جارٍ المعالجة...' : paymentMethod === 'STRIPE' ? '💳 ادفع الآن' : '✅ تأكيد الطلب'}
          </button>
          {paymentMethod === 'STRIPE' && (
            <p className="text-center text-xs text-gray-400 mt-2">للتجربة: <span className="font-mono">4242 4242 4242 4242</span></p>
          )}
        </div>
      </form>
    </div>
  )
}
