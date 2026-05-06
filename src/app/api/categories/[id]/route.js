import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Category from '@/models/Category'
import { requireAdmin } from '@/lib/jwt'

export async function DELETE(req, { params }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  try {
    await connectDB()
    await Category.findByIdAndDelete(params.id)
    return NextResponse.json({ message: 'تم حذف التصنيف' })
  } catch {
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}
