'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { FiUsers, FiPackage, FiShoppingBag, FiTrendingUp } from 'react-icons/fi'

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cards = stats
    ? [
        { label: 'المستخدمون',  value: stats.users,                    icon: <FiUsers size={22} />,      color: 'bg-blue-50   text-blue-600' },
        { label: 'المنتجات',    value: stats.products,                  icon: <FiPackage size={22} />,    color: 'bg-green-50  text-green-600' },
        { label: 'الطلبات',     value: stats.orders,                    icon: <FiShoppingBag size={22} />,color: 'bg-orange-50 text-orange-600' },
        { label: 'الإيرادات',   value: `${Math.round(stats.revenue)} ج.م`, icon: <FiTrendingUp size={22} />, color: 'bg-purple-50 text-purple-600' }
      ]
    : []

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">لوحة التحكم</h1>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                {c.icon}
              </div>
              <p className="text-2xl font-bold text-gray-800">{c.value}</p>
              <p className="text-gray-400 text-sm mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-800 mb-2">روابط سريعة</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { href: '/admin/users',         label: 'إدارة المستخدمين' },
            { href: '/admin/products',      label: 'إدارة المنتجات'   },
            { href: '/admin/notifications', label: 'إرسال إشعار'      },
            { href: '/admin/newsletter',    label: 'إرسال نشرة'       }
          ].map(l => (
            <a key={l.href} href={l.href}
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
