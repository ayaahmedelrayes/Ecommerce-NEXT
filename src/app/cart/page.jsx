'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()
  const total = getTotal()

  if (items.length === 0) return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center gap-4 text-gray-400">
      <div className="text-7xl">🛒</div>
      <p className="text-xl font-medium text-gray-600">السلة فارغة</p>
      <Link href="/products" className="bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 font-semibold transition-colors">
        تسوق الآن
      </Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">سلة التسوق ({items.length})</h1>
      <div className="grid lg:grid-cols-3 gap-6">

        {/* منتجات السلة */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                {item.image
                  ? <Image src={item.image} alt={item.name} fill className="object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate text-sm">{item.name}</p>
                <p className="text-blue-600 font-bold mt-1">{item.price} ج.م</p>
              </div>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2.5 py-2 hover:bg-gray-50 transition-colors">
                  <FiMinus size={12} />
                </button>
                <span className="px-3 py-2 font-semibold text-gray-800 min-w-8 text-center text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2.5 py-2 hover:bg-gray-50 transition-colors">
                  <FiPlus size={12} />
                </button>
              </div>
              <div className="text-right min-w-16">
                <p className="font-bold text-gray-800 text-sm">{(item.price * item.quantity).toFixed(0)} ج.م</p>
              </div>
              <button onClick={() => removeItem(item.id)}
                className="text-gray-300 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50">
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* ملخص */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="font-bold text-gray-800 text-lg mb-4">ملخص الطلب</h2>
          <div className="space-y-2 mb-4">
            {items.map(i => (
              <div key={i.id} className="flex justify-between text-sm text-gray-500">
                <span className="truncate ml-2">{i.name} × {i.quantity}</span>
                <span className="flex-shrink-0">{(i.price * i.quantity).toFixed(0)} ج.م</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-800 text-lg mb-5">
            <span>الإجمالي</span>
            <span className="text-blue-600">{total.toFixed(0)} ج.م</span>
          </div>
          <Link href="/checkout"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
            <FiArrowLeft size={18} /> إتمام الشراء
          </Link>
          <Link href="/products" className="block text-center text-gray-400 hover:text-gray-600 text-sm mt-3 transition-colors">
            مواصلة التسوق
          </Link>
        </div>
      </div>
    </div>
  )
}
