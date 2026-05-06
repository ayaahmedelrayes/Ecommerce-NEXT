'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { FiBell, FiBellOff } from 'react-icons/fi'

export default function PushNotificationButton() {
  const { user } = useAuth()
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [supported, setSupported]   = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setSupported(true)
      navigator.serviceWorker.ready.then(reg =>
        reg.pushManager.getSubscription().then(sub => setSubscribed(!!sub))
      )
    }
  }, [])

  if (!supported) return null

  const handleClick = async () => {
    if (!user) return toast.error('سجّل دخولك أولاً لتفعيل الإشعارات')
    if (subscribed) return toast('أنت مشترك بالفعل في الإشعارات ✅')
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '')
      })
      await api.post('/notifications/subscribe', sub)
      setSubscribed(true)
      toast.success('تم تفعيل الإشعارات! 🔔')
    } catch (err) {
      console.error(err)
      toast.error('فشل تفعيل الإشعارات. تأكد من الإذن في المتصفح.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={loading}
      className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60
        ${subscribed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
      {subscribed ? <FiBell size={14} /> : <FiBellOff size={14} />}
      {loading ? '...' : subscribed ? 'إشعارات مفعّلة' : 'فعّل الإشعارات'}
    </button>
  )
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}
