'use client'
import { useEffect, useState, Suspense} from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'

function SuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const method  = searchParams.get('method')
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (orderId) {
      api.get(`/orders/${orderId}`).then(r => setOrder(r.data)).catch(() => {})
    }
  }, [orderId])

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">تم الطلب بنجاح!</h1>
        <p className="text-gray-500 mb-6 text-sm">
          {method === 'cash'
            ? 'سيتم التواصل معك قريباً لترتيب التوصيل.'
            : 'تم تأكيد دفعتك بنجاح. شكراً لتسوقك!'}
        </p>

        {order && (
          <div className="bg-gray-50 rounded-xl p-4 text-right mb-6 text-sm text-gray-600 border border-gray-100">
            <p className="font-bold text-gray-800 mb-3 text-center">تفاصيل الطلب</p>
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-medium">{(item.price * item.quantity).toFixed(0)} ج.م</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-gray-800 pt-2 mt-1">
              <span>الإجمالي</span>
              <span className="text-blue-600">{order.total?.toFixed(0)} ج.م</span>
            </div>
          </div>
        )}

        <Link href="/products"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors w-full">
          مواصلة التسوق
        </Link>
      </div>
    </div>
  )
  export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"/></div>}>
      <SuccessContent />
    </Suspense>
  )
}
}
