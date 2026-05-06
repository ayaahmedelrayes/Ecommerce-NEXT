import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { connectDB } from '@/lib/db'
import PushSubscription from '@/models/PushSubscription'
import Notification from '@/models/Notification'
import { requireAdmin } from '@/lib/jwt'

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export async function POST(req) {
  const { error } = await requireAdmin(req)
  if (error) return error
  try {
    await connectDB()
    const { title, body, url } = await req.json()
    const subs = await PushSubscription.find()
    let sent = 0

    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          JSON.stringify({ title, body, url: url || '/' })
        )
        sent++
      } catch (err) {
        if (err.statusCode === 410) {
          await PushSubscription.findByIdAndDelete(sub._id)
        }
      }
    }

    await Notification.create({ title, body, url, sentCount: sent })
    return NextResponse.json({ message: `تم الإرسال لـ ${sent} مستخدم` })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'خطأ في الإرسال' }, { status: 500 })
  }
}
