import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import NewsletterSub from '@/models/NewsletterSub'
import { sendNewsletterEmail } from '@/lib/email'
import { requireAdmin } from '@/lib/jwt'

// POST — اشتراك
export async function POST(req) {
  try {
    await connectDB()
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'الإيميل مطلوب' }, { status: 400 })

    const exists = await NewsletterSub.findOne({ email })
    if (exists) return NextResponse.json({ message: 'أنت مشترك بالفعل!' })

    // نجيب المستخدم لو عنده توكن
    let userId = null
    try {
      const authHeader = req.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const { requireAuth } = await import('@/lib/jwt')
        const result = await requireAuth(req)
        userId = result.user?._id || null
      }
    } catch {}

    await NewsletterSub.create({ email, user: userId })
    return NextResponse.json({ message: 'تم الاشتراك في النشرة البريدية! 🎉' }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}

// PUT — إرسال نشرة (أدمن فقط)
export async function PUT(req) {
  const { error } = await requireAdmin(req)
  if (error) return error
  try {
    await connectDB()
    const { subject, content } = await req.json()
    const subs   = await NewsletterSub.find({ isActive: true })
    const emails = subs.map(s => s.email)
    if (emails.length === 0) return NextResponse.json({ message: 'ما فيش مشتركين' })
    await sendNewsletterEmail(emails, subject, content)
    return NextResponse.json({ message: `تم الإرسال لـ ${emails.length} مشترك` })
  } catch {
    return NextResponse.json({ error: 'خطأ في الإرسال' }, { status: 500 })
  }
}
