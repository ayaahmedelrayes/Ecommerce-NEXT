import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import PushSubscription from '@/models/PushSubscription'
import { requireAuth } from '@/lib/jwt'

export async function POST(req) {
  const { user, error } = await requireAuth(req)
  if (error) return error
  try {
    await connectDB()
    const { endpoint, keys } = await req.json()
    await PushSubscription.findOneAndUpdate(
      { user: user._id },
      { endpoint, keys },
      { upsert: true, new: true }
    )
    return NextResponse.json({ message: 'تم الاشتراك في الإشعارات' })
  } catch {
    return NextResponse.json({ error: 'خطأ في الاشتراك' }, { status: 500 })
  }
}
