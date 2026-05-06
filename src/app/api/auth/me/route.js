import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/jwt'

export async function GET(req) {
  const { user, error } = await requireAuth(req)
  if (error) return error
  return NextResponse.json({ user })
}
