import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req) {
  try {
    await connectDB()
    const { name, email, phone, password } = await req.json()

    if (!name || !email || !password)
      return NextResponse.json({ error: 'الاسم والإيميل وكلمة المرور مطلوبين' }, { status: 400 })

    if (password.length < 6)
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 })

    const exists = await User.findOne({ email })
    if (exists)
      return NextResponse.json({ error: 'الإيميل ده مستخدم بالفعل' }, { status: 400 })

    const verificationToken   = crypto.randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const user = await User.create({ name, email, phone, password, verificationToken, verificationExpires })

    try {
      await sendVerificationEmail(email, name, verificationToken)
    } catch (mailErr) {
      console.error('Email error:', mailErr.message)
    }

    return NextResponse.json(
      { message: 'تم إنشاء الحساب! راجع إيميلك لتأكيد الحساب.', userId: user._id },
      { status: 201 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}
