const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true, // e.g. "10:00 - 10:30"
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['video', 'in-person'],
    default: 'video',
  },
  symptoms: {
    type: String, // patient describes symptoms before booking
  },
  notes: {
    type: String, // doctor's notes after consultation
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid',
  },
  paymentId: {
    type: String, // Razorpay/Stripe payment ID
  },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);