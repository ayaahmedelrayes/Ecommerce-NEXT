import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  body:      { type: String, required: true },
  url:       { type: String, default: '/' },
  sentCount: { type: Number, default: 0 }
}, { timestamps: true })

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema)
