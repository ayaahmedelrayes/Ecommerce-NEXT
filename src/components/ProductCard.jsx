'use client'
import Link from 'next/link'
import Image from 'next/image'
import { FiShoppingCart } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'
import PushNotificationButton from '@/components/PushNotificationButton'
export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem)

  const handleAdd = () => {
    addItem({
      id:    product._id,
      name:  product.name,
      price: product.price,
      image: product.images?.[0] || null,
      slug:  product.slug
    })
    toast.success('تمت الإضافة للسلة! 🛒')
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group">
      <Link href={`/products/${product.slug}`} className="block relative h-48 bg-gray-50 overflow-hidden">
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-red-500 px-3 py-1 rounded-full">نفذ المخزون</span>
          </div>
        )}
      </Link>

      <div className="p-4">
        <p className="text-xs text-blue-500 font-medium mb-1">{product.category?.name}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-snug mb-3">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-blue-600">{product.price} ج.م</span>
            {product.comparePrice > product.price && (
              <span className="text-xs text-gray-400 line-through mr-1">{product.comparePrice}</span>
            )}
          </div>
          <button onClick={handleAdd} disabled={product.stock === 0}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
