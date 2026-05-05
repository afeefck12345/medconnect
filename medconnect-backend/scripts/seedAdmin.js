require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')

const run = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@medconnect.com'
  const password = process.env.ADMIN_PASSWORD || 'Admin19'
  const name = process.env.ADMIN_NAME || 'Admin'

  await mongoose.connect(process.env.MONGO_URI)

  const existing = await User.findOne({ email })
  if (existing) {
    existing.role = 'admin'
    if (process.env.RESET_ADMIN_PASSWORD === 'true') {
      existing.password = password
    }
    await existing.save()
    console.log(`Admin user updated for ${email}`)
  } else {
    await User.create({
      name,
      email,
      password,
      role: 'admin',
    })
    console.log(`Admin user created for ${email}`)
  }

  await mongoose.disconnect()
}

run().catch(async (error) => {
  console.error(error)
  await mongoose.disconnect()
  process.exit(1)
})
