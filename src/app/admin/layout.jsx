'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { FiGrid, FiUsers, FiPackage, FiTag, FiExternalLink, FiBell, FiMail } from 'react-icons/fi'

const links = [
  { href: '/admin',               label: 'لوحة التحكم', icon: <FiGrid size={17} /> },
  { href: '/admin/users',         label: 'المستخدمون',  icon: <FiUsers size={17} /> },
  { href: '/admin/products',      label: 'المنتجات',    icon: <FiPackage size={17} /> },
  { href: '/admin/categories',    label: 'التصنيفات',   icon: <FiTag size={17} /> },
  { href: '/admin/notifications', label: 'الإشعارات',   icon: <FiBell size={17} /> },
  { href: '/admin/newsletter',    label: 'النشرة',      icon: <FiMail size={17} /> }
]

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth()
  const router    = useRouter()
  const pathname  = usePathname()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.replace('/login')
    }
  }, [user, loading, router])

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <aside className="w-52 bg-white border-l border-gray-200 flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs text-gray-400 mb-0.5">مرحباً،</p>
          <p className="font-bold text-gray-800 truncate text-sm">{user.name}</p>
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">أدمن</span>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {links.map(l => {
            const active = pathname === l.href
            return (
              <Link key={l.href} href={l.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors
                  ${active
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}>
                <span className={active ? 'text-blue-600' : 'text-gray-400'}>{l.icon}</span>
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <Link href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 text-sm transition-colors">
            <FiExternalLink size={15} /> الموقع
          </Link>
        </div>
      </aside>

      {/* المحتوى */}
      <main className="flex-1 p-6 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
