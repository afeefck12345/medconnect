const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointmentById,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Patient routes
router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/my', protect, authorize('patient'), getPatientAppointments);
router.put('/:id/cancel', protect, authorize('patient'), cancelAppointment);

// Doctor routes
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.put('/:id/status', protect, authorize('doctor'), updateAppointmentStatus);

// Shared
router.get('/:id', protect, getAppointmentById);

module.exports = router;