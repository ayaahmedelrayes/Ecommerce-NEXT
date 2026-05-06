import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import { requireAuth } from '@/lib/jwt'

export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()
    const { items, paymentMethod, shippingAddress, guestEmail } = body

    // نجيب المستخدم لو عنده توكن (اختياري للـ guests)
    let userId = null
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const { user } = await requireAuth(req)
        userId = user?._id || null
      } catch {}
    }

    if (!items || items.length === 0)
      return NextResponse.json({ error: 'السلة فارغة' }, { status: 400 })

    let subtotal = 0
    const orderItems = []
    for (const item of items) {
      const product = await Product.findById(item.id)
      if (!product || !product.isActive)
        return NextResponse.json({ error: `المنتج ${item.name} غير متوفر` }, { status: 400 })
      if (product.stock < item.quantity)
        return NextResponse.json({ error: `المخزون غير كافي لـ ${product.name}` }, { status: 400 })

      subtotal += product.price * item.quantity
      orderItems.push({
        product:  product._id,
        name:     product.name,
        price:    product.price,
        quantity: item.quantity,
        image:    product.images?.[0] || null
      })
    }

    const order = await Order.create({
      user: userId,
      guestEmail: userId ? null : (guestEmail || null),
      items: orderItems,
      subtotal,
      total: subtotal,
      paymentMethod,
      shippingAddress
    })

    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 })
  }
}
