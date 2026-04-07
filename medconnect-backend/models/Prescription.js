const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },   // e.g. "500mg"
  frequency: { type: String, required: true }, // e.g. "Twice a day"
  duration: { type: String, required: true },  // e.g. "7 days"
  instructions: { type: String },              // e.g. "After food"
});

const prescriptionSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
    unique: true, // one prescription per appointment
  },
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
  medicines: [medicineSchema],
  diagnosis: { type: String, required: true },
  notes: { type: String },         // additional doctor notes
  followUpDate: { type: Date },    // optional follow-up date
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);