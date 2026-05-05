const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  rescheduleAppointment,
  getAppointmentById,
  getPatientHistoryForDoctor,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Patient routes
router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/my', protect, authorize('patient'), getPatientAppointments);
router.put('/:id/cancel', protect, authorize('patient'), cancelAppointment);
router.put('/:id/reschedule', protect, authorize('patient'), rescheduleAppointment);

// Doctor routes
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.get('/doctor/patient/:patientId/history', protect, authorize('doctor'), getPatientHistoryForDoctor);
router.put('/:id/status', protect, authorize('doctor'), updateAppointmentStatus);

// Shared
router.get('/:id', protect, getAppointmentById);

module.exports = router;