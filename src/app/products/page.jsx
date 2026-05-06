'use client'
import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import ProductCard from '@/components/ProductCard'
import { FiSearch, FiFilter } from 'react-icons/fi'
import PushNotificationButton from '@/components/PushNotificationButton'
export default function ProductsPage() {
  const [products, setProducts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [pagination, setPagination] = useState({})
  const [search, setSearch]         = useState('')
  const [minPrice, setMinPrice]     = useState('')
  const [maxPrice, setMaxPrice]     = useState('')
  const [page, setPage]             = useState(1)

  const fetch = useCallback(async (p = page) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search)   params.set('search', search)
      if (minPrice) params.set('minPrice', minPrice)
      if (maxPrice) params.set('maxPrice', maxPrice)
      params.set('page', p)
      const { data } = await api.get(`/products?${params}`)
      setProducts(data.products)
      setPagination(data.pagination)
    } finally {
      setLoading(false)
    }
  }, [search, minPrice, maxPrice, page])

  useEffect(() => { fetch() }, [page])

  const handleFilter = e => { e.preventDefault(); setPage(1); fetch(1) }
  const handleReset  = () => { setSearch(''); setMinPrice(''); setMaxPrice(''); setPage(1); setTimeout(() => fetch(1), 0) }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
<h1 className="text-3xl font-bold text-gray-800 mb-6">المنتجات</h1>
<div className="flex justify-end mb-4">
  <PushNotificationButton />
</div>
      {/* فلاتر */}
      <form onSubmit={handleFilter}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-52">
          <label className="block text-xs font-medium text-gray-500 mb-1">البحث</label>
          <div className="relative">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pr-9 pl-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ابحث عن منتج..." />
          </div>
        </div>
        <div className="w-28">
          <label className="block text-xs font-medium text-gray-500 mb-1">السعر من</label>
          <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} min="0"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0 ج.م" />
        </div>
        <div className="w-28">
          <label className="block text-xs font-medium text-gray-500 mb-1">السعر إلى</label>
          <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min="0"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="9999 ج.م" />
        </div>
        <button type="submit"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2 transition-colors">
          <FiFilter size={15} /> فلتر
        </button>
        <button type="button" onClick={handleReset}
          className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-lg text-sm hover:bg-gray-200 transition-colors">
          مسح
        </button>
      </form>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-lg">ما فيش منتجات تطابق البحث</p>
        </div>
      ) : (
        <>
          <p className="text-gray-400 text-sm mb-4">{pagination.total} منتج</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
