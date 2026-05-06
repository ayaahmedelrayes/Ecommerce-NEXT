import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">مرحباً بك في متجرنا 🛒</h1>
      <p className="text-gray-500 text-lg mb-8">اكتشف أفضل المنتجات بأسعار لا تقاوم</p>
      <Link href="/products"
        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-2xl text-lg font-semibold hover:bg-blue-700 transition-colors">
        تصفح المنتجات
      </Link>
    </div>
  )
}
