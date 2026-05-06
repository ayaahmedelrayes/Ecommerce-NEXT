import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import { requireAdmin } from '@/lib/jwt'

const makeSlug = (name) =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now()

export async function GET(req) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const search   = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const category = searchParams.get('category')
    const page     = Number(searchParams.get('page') || 1)
    const limit    = Number(searchParams.get('limit') || 12)

    const query = { isActive: true }
    if (search)   query.$text = { $search: search }
    if (category) query.category = category
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    const skip = (page - 1) * limit
    const [products, total] = await Promise.all([
      Product.find(query).populate('category', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query)
    ])

    return NextResponse.json({ products, pagination: { total, page, pages: Math.ceil(total / limit) } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}

export async function POST(req) {
  const { error } = await requireAdmin(req)
  if (error) return error
  try {
    await connectDB()
    const body = await req.json()
    const { name, description, price, comparePrice, images, stock, category } = body
    if (!name || price == null || stock == null || !category)
      return NextResponse.json({ error: 'الاسم والسعر والمخزون والتصنيف مطلوبين' }, { status: 400 })

    const slug = makeSlug(name)
    const product = await Product.create({ name, slug, description, price, comparePrice, images: images || [], stock, category })
    const populated = await product.populate('category', 'name slug')
    return NextResponse.json(populated, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}
