const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: { type: String }, // legacy support
  endTime: { type: String },   // legacy support
  slots: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
});

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  specialization: { type: String, required: true },
  qualifications: [{ type: String }],
  experience: { type: Number, required: true }, // in years
  consultationFee: { type: Number, required: true },
  bio: { type: String },
  clinicName: { type: String },
  clinicAddress: { type: String },
  availability: [availabilitySchema],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
