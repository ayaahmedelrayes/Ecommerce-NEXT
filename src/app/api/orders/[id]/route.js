import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'

export async function GET(req, { params }) {
  try {
    await connectDB()
    const order = await Order.findById(params.id)
    if (!order) return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}
