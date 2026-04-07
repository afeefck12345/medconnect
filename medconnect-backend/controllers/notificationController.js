const sendEmail = require('../utils/sendEmail');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Send appointment confirmation email
// @route   POST /api/notifications/appointment-confirm
// @access  Private
const sendAppointmentConfirmation = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'name email')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await sendEmail({
      to: appointment.patient.email,
      subject: 'Appointment Confirmed — MedConnect',
      html: `
        <h2>Hello ${appointment.patient.name},</h2>
        <p>Your appointment has been <strong>confirmed</strong>.</p>
        <ul>
          <li><strong>Doctor:</strong> ${appointment.doctor.user.name}</li>
          <li><strong>Date:</strong> ${new Date(appointment.date).toDateString()}</li>
          <li><strong>Time:</strong> ${appointment.timeSlot}</li>
          <li><strong>Type:</strong> ${appointment.type}</li>
        </ul>
        <p>Thank you for using MedConnect!</p>
      `,
    });

    res.json({ message: 'Confirmation email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send appointment reminder email
// @route   POST /api/notifications/reminder
// @access  Private
const sendReminder = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'name email')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await sendEmail({
      to: appointment.patient.email,
      subject: 'Appointment Reminder — MedConnect',
      html: `
        <h2>Hello ${appointment.patient.name},</h2>
        <p>This is a reminder for your upcoming appointment.</p>
        <ul>
          <li><strong>Doctor:</strong> ${appointment.doctor.user.name}</li>
          <li><strong>Date:</strong> ${new Date(appointment.date).toDateString()}</li>
          <li><strong>Time:</strong> ${appointment.timeSlot}</li>
          <li><strong>Type:</strong> ${appointment.type}</li>
        </ul>
        <p>Please be on time. See you soon!</p>
      `,
    });

    res.json({ message: 'Reminder email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendAppointmentConfirmation,
  sendReminder,
};