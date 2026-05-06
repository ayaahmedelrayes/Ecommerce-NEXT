import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image:    { type: String, default: null }
}, { _id: false })

const orderSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  guestEmail:     { type: String, default: null },
  items:          [orderItemSchema],
  subtotal:       { type: Number, required: true },
  total:          { type: Number, required: true },
  paymentMethod:  { type: String, enum: ['STRIPE', 'CASH'], required: true },
  paymentStatus:  { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
  stripeSessionId:{ type: String, default: null },
  shippingAddress: {
    fullName: String,
    address:  String,
    city:     String,
    phone:    String
  }
}, { timestamps: true })

export default mongoose.models.Order || mongoose.model('Order', orderSchema)
