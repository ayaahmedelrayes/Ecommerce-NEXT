import mongoose from 'mongoose'

const newsletterSubSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true },
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.models.NewsletterSub || mongoose.model('NewsletterSub', newsletterSubSchema)
