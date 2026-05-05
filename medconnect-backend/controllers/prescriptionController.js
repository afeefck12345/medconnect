const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');

const validateMedicines = (medicines = []) => {
  if (!Array.isArray(medicines) || medicines.length === 0) {
    return 'At least one medicine is required.'
  }

  const hasInvalidEntry = medicines.some((med) => {
    return !med?.name || !med?.dosage || !med?.frequency || !med?.duration
  })

  if (hasInvalidEntry) {
    return 'Each medicine must include name, dosage, frequency, and duration.'
  }

  return null
}

// @desc    Create a prescription (after consultation)
// @route   POST /api/prescriptions
// @access  Private (doctor only)
const createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, diagnosis, notes, followUpDate } = req.body;
    const medicinesValidationError = validateMedicines(medicines)
    if (medicinesValidationError) {
      return res.status(400).json({ message: medicinesValidationError })
    }

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

    await Notification.create({
      recipient: appointment.patient,
      title: 'New prescription added',
      message: `Your doctor has added a prescription for your appointment on ${new Date(appointment.date).toLocaleDateString()}.`,
      type: 'prescription',
      metadata: { appointmentId: appointment._id, prescriptionId: prescription._id },
    })

    res.status(201).json({ message: 'Prescription created', prescription });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(error.errors).map((err) => err.message).join(', ') })
    }
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

    const doctorProfile = req.user.role === 'doctor'
      ? await Doctor.findOne({ user: req.user._id })
      : null
    const isPatientOwner = prescription.patient?._id?.toString() === req.user._id.toString()
    const isDoctorOwner = doctorProfile && prescription.doctor?._id?.toString() === doctorProfile._id.toString()

    if (!isPatientOwner && !isDoctorOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this prescription' })
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
      .populate('appointment', 'date timeSlot type status')
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
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' })
    }

    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (prescription.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this prescription' });
    }

    if (medicines) {
      const medicinesValidationError = validateMedicines(medicines)
      if (medicinesValidationError) {
        return res.status(400).json({ message: medicinesValidationError })
      }
    }

    prescription.medicines = medicines || prescription.medicines;
    prescription.diagnosis = diagnosis || prescription.diagnosis;
    prescription.notes = notes || prescription.notes;
    prescription.followUpDate = followUpDate || prescription.followUpDate;

    await prescription.save();

    res.json({ message: 'Prescription updated', prescription });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(error.errors).map((err) => err.message).join(', ') })
    }
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