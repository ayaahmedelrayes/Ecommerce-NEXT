'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'
import { FiShoppingCart, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const router   = useRouter()
  const [product, setProduct]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    api.get(`/products/${slug}`)
      .then(r => setProduct(r.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product._id, name: product.name, price: product.price, image: product.images?.[0], slug: product.slug })
    }
    toast.success(`تمت إضافة ${quantity} قطعة للسلة! 🛒`)
  }

  if (loading) return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  )
  if (!product) return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center gap-4 text-gray-400">
      <div className="text-5xl">😕</div>
      <p>المنتج غير موجود</p>
      <button onClick={() => router.back()} className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700">رجوع</button>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mb-6 transition-colors">
        <FiArrowRight size={16} /> رجوع للمنتجات
      </button>

      <div className="bg-white rounded-2xl shadow-sm p-6 grid md:grid-cols-2 gap-8">
        {/* صور */}
        <div>
          <div className="relative h-72 rounded-xl overflow-hidden bg-gray-50 mb-3">
            {product.images?.[activeImg] ? (
              <Image src={product.images[activeImg]} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl">📦</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors
                    ${activeImg === i ? 'border-blue-500' : 'border-gray-200 hover:border-gray-400'}`}>
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* التفاصيل */}
        <div>
          <p className="text-blue-500 text-sm font-medium mb-2">{product.category?.name}</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-3 leading-snug">{product.name}</h1>
          {product.description && (
            <p className="text-gray-500 text-sm leading-relaxed mb-4">{product.description}</p>
          )}

          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-3xl font-bold text-blue-600">{product.price} ج.م</span>
            {product.comparePrice > product.price && (
              <span className="text-gray-400 line-through">{product.comparePrice} ج.م</span>
            )}
          </div>

          <p className={`text-sm font-medium mb-5 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `✅ متوفر (${product.stock} قطعة)` : '❌ نفذ المخزون'}
          </p>

          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-4 mb-5">
                <span className="text-gray-700 font-medium text-sm">الكمية:</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors">
                    <FiMinus size={14} />
                  </button>
                  <span className="px-5 py-2 font-bold text-gray-800 min-w-12 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors">
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>
              <button onClick={handleAdd}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                <FiShoppingCart size={18} /> أضف للسلة — {(product.price * quantity).toFixed(0)} ج.م
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
