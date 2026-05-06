import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { requireAdmin } from '@/lib/jwt'

export async function GET(req) {
  const { error } = await requireAdmin(req)
  if (error) return error
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const page   = Number(searchParams.get('page') || 1)
    const limit  = Number(searchParams.get('limit') || 20)
    const query  = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {}

    const skip = (page - 1) * limit
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query)
    ])
    return NextResponse.json({ users, pagination: { total, page, pages: Math.ceil(total / limit) } })
  } catch {
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}
