'use client'
import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { FiSearch, FiToggleLeft, FiToggleRight } from 'react-icons/fi'

export default function AdminUsersPage() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  const fetchUsers = useCallback(async (q = search) => {
    setLoading(true)
    try {
      const { data } = await api.get(`/admin/users?search=${encodeURIComponent(q)}`)
      setUsers(data.users)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { fetchUsers('') }, [])

  const toggleUser = async (id) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}`)
      toast.success(data.message)
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: data.user.isActive } : u))
    } catch (err) {
      toast.error(err.response?.data?.error || 'حدث خطأ')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">المستخدمون</h1>
        <form onSubmit={e => { e.preventDefault(); fetchUsers(search) }} className="flex gap-2">
          <div className="relative">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو الإيميل..."
              className="pr-9 pl-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-60" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700">بحث</button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['الاسم', 'البريد الإلكتروني', 'الهاتف', 'الدور', 'تاريخ التسجيل', 'الحالة', 'إجراء'].map(h => (
                  <th key={h} className="text-right px-4 py-3 text-gray-500 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-2">👥</div>
                    <p>ما فيش مستخدمين</p>
                  </td>
                </tr>
              ) : users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3 text-gray-400">{u.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${u.role === 'ADMIN' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                      {u.role === 'ADMIN' ? 'أدمن' : 'عميل'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${u.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                      {u.isActive ? 'نشط' : 'موقوف'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== 'ADMIN' && (
                      <button onClick={() => toggleUser(u._id)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                          ${u.isActive
                            ? 'bg-red-50 text-red-500 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                        {u.isActive
                          ? <><FiToggleRight size={14} /> تعطيل</>
                          : <><FiToggleLeft  size={14} /> تفعيل</>}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
