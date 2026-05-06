import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Product from '@/models/Product'
import Order from '@/models/Order'
import { requireAdmin } from '@/lib/jwt'

export async function GET(req) {
  const { error } = await requireAdmin(req)
  if (error) return error
  try {
    await connectDB()
    const [users, products, orders, revenueResult] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'PAID' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ])
    return NextResponse.json({
      users,
      products,
      orders,
      revenue: revenueResult[0]?.total || 0
    })
  } catch {
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}
