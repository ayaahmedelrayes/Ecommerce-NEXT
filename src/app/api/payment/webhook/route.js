import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// ⚠️ مهم: لازم نقرأ الـ raw body عشان Stripe يتحقق من الـ signature
export async function POST(req) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const orderId = session.metadata?.orderId

    if (orderId) {
      await connectDB()
      const order = await Order.findById(orderId)
      if (order && order.paymentStatus !== 'PAID') {
        // خصم المخزون
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
        }
        order.paymentStatus   = 'PAID'
        order.stripeSessionId = session.id
        await order.save()
      }
    }
  }

  return NextResponse.json({ received: true })
}
