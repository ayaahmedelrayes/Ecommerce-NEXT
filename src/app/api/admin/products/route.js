import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import { requireAdmin } from '@/lib/jwt'

export async function GET(req) {
  const { error } = await requireAdmin(req)
  if (error) return error
  try {
    await connectDB()
    const products = await Product.find().populate('category', 'name').sort({ createdAt: -1 })
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}
