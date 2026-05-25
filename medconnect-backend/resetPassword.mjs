import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import User from './models/User.js'

const reset = async () => {
  await mongoose.connect('mongodb+srv://afeef123:Afeef123@cluster0.b7fgzhm.mongodb.net/medconnect?appName=Cluster0')
  const hash = await bcrypt.hash('Admin19', 10)
  await User.updateOne({ email: 'admin@medconnect.com' }, { password: hash })
  console.log('Password reset done!')
  process.exit()
}

reset()