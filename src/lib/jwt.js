import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { connectDB } from './db'
import User from '@/models/User'

const SECRET = process.env.JWT_SECRET

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET)
}

// Middleware helper: تُستخدم داخل API routes
export async function requireAuth(req) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: NextResponse.json({ error: 'غير مصرح، سجّل دخولك أولاً' }, { status: 401 }) }
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = verifyToken(token)
    await connectDB()
    const user = await User.findById(decoded.id).select('-password -verificationToken -verificationExpires')
    if (!user) return { error: NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 401 }) }
    if (!user.isActive) return { error: NextResponse.json({ error: 'الحساب موقوف' }, { status: 403 }) }
    return { user }
  } catch {
    return { error: NextResponse.json({ error: 'توكن غير صالح' }, { status: 401 }) }
  }
}

export async function requireAdmin(req) {
  const result = await requireAuth(req)
  if (result.error) return result
  if (result.user.role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'مخصص للأدمن فقط' }, { status: 403 }) }
  }
  return result
}
