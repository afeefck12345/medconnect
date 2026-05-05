const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Review = require('../models/Review');
const Prescription = require('../models/Prescription');
const Notification = require('../models/Notification');

const createNotification = async (recipient, title, message, metadata = {}, type = 'appointment') => {
  if (!recipient) return;
  await Notification.create({ recipient, title, message, metadata, type });
};

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (patient only)
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, type, symptoms } = req.body;

    // Check doctor exists and is approved
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isApproved) {
      return res.status(404).json({ message: 'Doctor not found or not approved' });
    }

    // Check for slot conflict
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (conflict) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      type,
      symptoms,
    });

    await createNotification(
      doctor.user,
      'New appointment request',
      `A patient booked a ${type || 'video'} appointment on ${new Date(date).toLocaleDateString()} at ${timeSlot}.`,
      { appointmentId: appointment._id, role: 'doctor' }
    )

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments for logged-in patient
// @route   GET /api/appointments/my
// @access  Private (patient only)
const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email phone' } })
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments for logged-in doctor
// @route   GET /api/appointments/doctor
// @access  Private (doctor only)
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('patient', 'name email phone')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status (doctor accepts/rejects/completes)
// @route   PUT /api/appointments/:id/status
// @access  Private (doctor only)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['confirmed', 'cancelled', 'completed','rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    if (status === 'confirmed' && appointment.paymentStatus !== 'paid') {
      return res.status(400).json({
        message: 'Appointments must be paid before the doctor can confirm them',
      });
    }

    appointment.status = status;
    await appointment.save();

    await createNotification(
      appointment.patient,
      'Appointment status updated',
      `Your appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.timeSlot} is now ${status}.`,
      { appointmentId: appointment._id, role: 'patient', status }
    )

    res.json({ message: `Appointment ${status}`, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel appointment (patient cancels own appointment)
// @route   PUT /api/appointments/:id/cancel
// @access  Private (patient only)
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only the patient who booked can cancel
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    const doctor = await Doctor.findById(appointment.doctor).select('user')
    await createNotification(
      doctor?.user,
      'Appointment cancelled',
      `A patient cancelled appointment scheduled on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.timeSlot}.`,
      { appointmentId: appointment._id, role: 'doctor' }
    )

    res.json({ message: 'Appointment cancelled', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reschedule appointment (patient)
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (patient only)
const rescheduleAppointment = async (req, res) => {
  try {
    const { date, timeSlot, type, symptoms } = req.body
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reschedule this appointment' })
    }

    if (['completed', 'cancelled', 'rejected'].includes(appointment.status)) {
      return res.status(400).json({ message: `Cannot reschedule a ${appointment.status} appointment` })
    }

    const nextDate = date ? new Date(date) : appointment.date
    const nextTimeSlot = timeSlot || appointment.timeSlot

    const conflict = await Appointment.findOne({
      _id: { $ne: appointment._id },
      doctor: appointment.doctor,
      date: nextDate,
      timeSlot: nextTimeSlot,
      status: { $in: ['pending', 'confirmed'] },
    })

    if (conflict) {
      return res.status(400).json({ message: 'Selected reschedule slot is already booked' })
    }

    appointment.date = nextDate
    appointment.timeSlot = nextTimeSlot
    if (type) appointment.type = type
    if (typeof symptoms === 'string') appointment.symptoms = symptoms
    appointment.status = 'pending'
    await appointment.save()

    const doctor = await Doctor.findById(appointment.doctor).select('user')
    await createNotification(
      doctor?.user,
      'Appointment rescheduled',
      `A patient rescheduled appointment to ${new Date(appointment.date).toLocaleDateString()} at ${appointment.timeSlot}.`,
      { appointmentId: appointment._id, role: 'doctor' }
    )

    res.json({ message: 'Appointment rescheduled successfully', appointment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get doctor view of a patient's history
// @route   GET /api/appointments/doctor/patient/:patientId/history
// @access  Private (doctor only)
const getPatientHistoryForDoctor = async (req, res) => {
  try {
    const { patientId } = req.params
    const doctor = await Doctor.findOne({ user: req.user._id })
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' })
    }

    const appointments = await Appointment.find({
      doctor: doctor._id,
      patient: patientId,
    }).sort({ date: -1 })

    const prescriptions = await Prescription.find({
      doctor: doctor._id,
      patient: patientId,
    }).sort({ createdAt: -1 })

    const reviews = await Review.find({ patient: patientId, doctor: doctor._id }).sort({ createdAt: -1 })

    res.json({ appointments, prescriptions, reviews })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email phone' } });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const isPatientOwner = appointment.patient?._id?.toString() === req.user._id.toString();
    const doctor = req.user.role === 'doctor' ? await Doctor.findOne({ user: req.user._id }) : null;
    const isDoctorOwner = doctor && appointment.doctor?._id?.toString() === doctor._id.toString();

    if (!isPatientOwner && !isDoctorOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  rescheduleAppointment,
  getAppointmentById,
  getPatientHistoryForDoctor,
};
