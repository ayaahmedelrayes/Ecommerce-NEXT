import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import { requireAdmin } from '@/lib/jwt'

export async function GET(req, { params }) {
  try {
    await connectDB()
    const product = await Product.findOne({ slug: params.slug, isActive: true }).populate('category', 'name slug')
    if (!product) return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  try {
    await connectDB()
    const body = await req.json()
    // لو slug مش موجود في params، نستخدم id
    const product = await Product.findOneAndUpdate(
      { slug: params.slug },
      body,
      { new: true }
    ).populate('category', 'name slug')
    if (!product) return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  try {
    await connectDB()
    await Product.findOneAndUpdate({ slug: params.slug }, { isActive: false })
    return NextResponse.json({ message: 'تم حذف المنتج' })
  } catch {
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}
