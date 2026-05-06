import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { signToken } from '@/lib/jwt'

export async function POST(req) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    if (!email || !password)
      return NextResponse.json({ error: 'الإيميل وكلمة المرور مطلوبين' }, { status: 400 })

    const user = await User.findOne({ email }).select('+password')
    if (!user || !user.password)
      return NextResponse.json({ error: 'الإيميل أو كلمة المرور غلط' }, { status: 401 })

    const isMatch = await user.comparePassword(password)
    if (!isMatch)
      return NextResponse.json({ error: 'الإيميل أو كلمة المرور غلط' }, { status: 401 })

    if (!user.isActive)
      return NextResponse.json({ error: 'الحساب موقوف، تواصل مع الأدمن' }, { status: 403 })

    if (!user.emailVerified)
      return NextResponse.json({ error: 'لازم تأكد إيميلك الأول' }, { status: 403 })

    const token = signToken({ id: user._id.toString() })

    return NextResponse.json({
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        image: user.image
      }
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}
