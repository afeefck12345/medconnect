const sendEmail = require('../utils/sendEmail');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

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

// @desc    Get my in-app notifications
// @route   GET /api/notifications/my
// @access  Private
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100)

    res.json(notifications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this notification' })
    }

    notification.isRead = true
    await notification.save()
    res.json(notification)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { $set: { isRead: true } })
    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  sendAppointmentConfirmation,
  sendReminder,
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};