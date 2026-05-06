import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: '' },
  image:       { type: String, default: null }
}, { timestamps: true })

export default mongoose.models.Category || mongoose.model('Category', categorySchema)
