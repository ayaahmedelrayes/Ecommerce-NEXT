import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { requireAdmin } from '@/lib/jwt'

export async function PATCH(req, { params }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  try {
    await connectDB()
    const user = await User.findById(params.id)
    if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    if (user.role === 'ADMIN') return NextResponse.json({ error: 'لا يمكن تعطيل الأدمن' }, { status: 400 })
    user.isActive = !user.isActive
    await user.save()
    return NextResponse.json({ message: user.isActive ? 'تم تفعيل الحساب' : 'تم تعطيل الحساب', user })
  } catch {
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  try {
    await connectDB()
    const user = await User.findById(params.id)
    if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    if (user.role === 'ADMIN') return NextResponse.json({ error: 'لا يمكن حذف الأدمن' }, { status: 400 })
    user.isActive = false
    await user.save()
    return NextResponse.json({ message: 'تم تعطيل المستخدم' })
  } catch {
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}
