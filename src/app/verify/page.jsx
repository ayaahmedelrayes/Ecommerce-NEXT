'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'

function VerifyPage() {
  const searchParams = useSearchParams()
  const [status, setStatus]   = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) { setStatus('error'); setMessage('رابط غير صالح'); return }
    api.get(`/auth/verify/${token}`)
      .then(r  => { setStatus('success'); setMessage(r.data.message) })
      .catch(e => { setStatus('error');   setMessage(e.response?.data?.error || 'حدث خطأ') })
  }, [searchParams])

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">جارٍ التحقق...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{message}</h2>
            <Link href="/login" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-semibold">
              سجّل دخولك
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-red-500 mb-2">{message}</h2>
            <p className="text-gray-400 text-sm">جرّب تسجّل من جديد.</p>
          </>
        )}
      </div>
    </div>
  )
  export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"/></div>}>
      <VerifyContent />
    </Suspense>
  )
}
}
