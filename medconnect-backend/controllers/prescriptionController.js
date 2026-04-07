const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Create a prescription (after consultation)
// @route   POST /api/prescriptions
// @access  Private (doctor only)
const createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, diagnosis, notes, followUpDate } = req.body;

    // Verify appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify the doctor owns this appointment
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to prescribe for this appointment' });
    }

    // Check if prescription already exists for this appointment
    const existing = await Prescription.findOne({ appointment: appointmentId });
    if (existing) {
      return res.status(400).json({ message: 'Prescription already exists for this appointment' });
    }

    const prescription = await Prescription.create({
      appointment: appointmentId,
      patient: appointment.patient,
      doctor: doctor._id,
      medicines,
      diagnosis,
      notes,
      followUpDate,
    });

    // Update appointment notes
    appointment.notes = diagnosis;
    await appointment.save();

    res.status(201).json({ message: 'Prescription created', prescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get prescription by appointment ID
// @route   GET /api/prescriptions/appointment/:appointmentId
// @access  Private (patient or doctor)
const getPrescriptionByAppointment = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({ appointment: req.params.appointmentId })
      .populate('patient', 'name email phone')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } });

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all prescriptions for logged-in patient
// @route   GET /api/prescriptions/my
// @access  Private (patient only)
const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
      .populate('appointment', 'date timeSlot type')
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all prescriptions written by logged-in doctor
// @route   GET /api/prescriptions/doctor
// @access  Private (doctor only)
const getDoctorPrescriptions = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const prescriptions = await Prescription.find({ doctor: doctor._id })
      .populate('patient', 'name email phone')
      .populate('appointment', 'date timeSlot type')
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a prescription
// @route   PUT /api/prescriptions/:id
// @access  Private (doctor only)
const updatePrescription = async (req, res) => {
  try {
    const { medicines, diagnosis, notes, followUpDate } = req.body;

    const doctor = await Doctor.findOne({ user: req.user._id });
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (prescription.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this prescription' });
    }

    prescription.medicines = medicines || prescription.medicines;
    prescription.diagnosis = diagnosis || prescription.diagnosis;
    prescription.notes = notes || prescription.notes;
    prescription.followUpDate = followUpDate || prescription.followUpDate;

    await prescription.save();

    res.json({ message: 'Prescription updated', prescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPrescription,
  getPrescriptionByAppointment,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  updatePrescription,
};