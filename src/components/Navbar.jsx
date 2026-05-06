'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useCartStore } from '@/store/cartStore'
import { FiShoppingCart, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const count = useCartStore(s => s.getCount())

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold text-blue-600 flex items-center gap-1.5">
          🛒 <span>متجرنا</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/products"
            className="text-gray-600 hover:text-blue-600 text-sm px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
            المنتجات
          </Link>

          <Link href="/cart" className="relative text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">
            <FiShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -top-0.5 -left-0.5 bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-1 mr-2">
              {user.role === 'ADMIN' && (
                <Link href="/admin"
                  className="flex items-center gap-1 text-orange-600 hover:text-orange-700 text-sm px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors">
                  <FiSettings size={15} /> الأدمن
                </Link>
              )}
              <span className="text-gray-500 text-sm hidden sm:block px-2">{user.name}</span>
              <button onClick={logout}
                className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="تسجيل الخروج">
                <FiLogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login"
              className="mr-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1.5 transition-colors">
              <FiUser size={15} /> دخول
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
