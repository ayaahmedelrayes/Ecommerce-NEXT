import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function GET(req, { params }) {
  try {
    await connectDB()
    const { token } = params

    const user = await User.findOne({
      verificationToken:   token,
      verificationExpires: { $gt: Date.now() }
    }).select('+verificationToken +verificationExpires')

    if (!user)
      return NextResponse.json({ error: 'الرابط غير صالح أو انتهت صلاحيته' }, { status: 400 })

    user.emailVerified       = new Date()
    user.verificationToken   = null
    user.verificationExpires = null
    await user.save()

    return NextResponse.json({ message: 'تم تأكيد الإيميل بنجاح! يمكنك تسجيل الدخول الآن.' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}
