import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Category from '@/models/Category'
import { requireAdmin } from '@/lib/jwt'

export async function GET() {
  try {
    await connectDB()
    const categories = await Category.find().sort({ name: 1 })
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}

export async function POST(req) {
  const { user, error } = await requireAdmin(req)
  if (error) return error
  try {
    await connectDB()
    const { name, description, image } = await req.json()
    if (!name) return NextResponse.json({ error: 'اسم التصنيف مطلوب' }, { status: 400 })
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || 
  'category-' + Date.now()
    const exists = await Category.findOne({ slug })
    if (exists) return NextResponse.json({ error: 'التصنيف ده موجود بالفعل' }, { status: 400 })
    const category = await Category.create({ name, slug, description, image })
    return NextResponse.json(category, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}
