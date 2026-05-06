import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { connectDB } from '@/lib/db'
import Product from '@/models/Product'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    await connectDB()
    const { items, orderId, guestEmail } = await req.json()

    const lineItems = []
    for (const item of items) {
      const product = await Product.findById(item.id)
      if (!product) return NextResponse.json({ error: `منتج غير موجود: ${item.id}` }, { status: 404 })
      lineItems.push({
        price_data: {
          currency: 'egp',
          product_data: {
            name:   product.name,
            images: product.images?.slice(0, 1) || []
          },
          unit_amount: Math.round(product.price * 100)
        },
        quantity: item.quantity
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items:           lineItems,
      mode:                 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      customer_email: guestEmail || undefined,
      metadata: { orderId: orderId?.toString() || '' }
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'خطأ في إنشاء جلسة الدفع' }, { status: 500 })
  }
}
