require('dotenv').config();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Get public Razorpay configuration
// @route   GET /api/payments/config
// @access  Private
const getPaymentConfig = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID) {
      return res.status(500).json({ message: 'Razorpay key is not configured on the server' });
    }

    return res.json({ key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private (patient only)
const createOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate({ path: 'doctor', select: 'consultationFee' });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Appointment already paid' });
    }

    const amount = appointment.doctor.consultationFee * 100; // convert to paise

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${appointmentId}`,
    });

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
// @access  Private (patient only)
const verifyPayment = async (req, res) => {
  try {
    const { appointmentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update appointment payment status
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { paymentStatus: 'paid', paymentId: razorpay_payment_id },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    const doctor = await Doctor.findById(appointment.doctor).select('user')
    await Notification.create({
      recipient: doctor?.user,
      title: 'Payment received',
      message: `Payment completed for appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.timeSlot}.`,
      type: 'payment',
      metadata: { appointmentId: appointment._id },
    })

    res.json({ message: 'Payment verified successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment status of appointment
// @route   GET /api/payments/:appointmentId
// @access  Private
const getPaymentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId)
      .select('paymentStatus paymentId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ paymentStatus: appointment.paymentStatus, paymentId: appointment.paymentId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, verifyPayment, getPaymentStatus, getPaymentConfig };
