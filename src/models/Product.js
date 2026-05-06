import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  slug:         { type: String, required: true, unique: true, lowercase: true },
  description:  { type: String, default: '' },
  price:        { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, default: null },
  images:       [{ type: String }],
  stock:        { type: Number, required: true, default: 0, min: 0 },
  category:     { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  isActive:     { type: Boolean, default: true }
}, { timestamps: true })

productSchema.index({ name: 'text', description: 'text' })

export default mongoose.models.Product || mongoose.model('Product', productSchema)
