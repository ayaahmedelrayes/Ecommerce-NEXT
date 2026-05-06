import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name:                { type: String, required: true, trim: true },
  email:               { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:               { type: String, trim: true, default: null },
  password:            { type: String, select: false },
  role:                { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
  isActive:            { type: Boolean, default: true },
  emailVerified:       { type: Date, default: null },
  verificationToken:   { type: String, default: null, select: false },
  verificationExpires: { type: Date, default: null, select: false },
  image:               { type: String, default: null }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.verificationToken
  delete obj.verificationExpires
  return obj
}

export default mongoose.models.User || mongoose.model('User', userSchema)
