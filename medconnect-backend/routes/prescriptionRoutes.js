const express = require('express');
const router = express.Router();
const {
  createPrescription,
  getPrescriptionByAppointment,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  updatePrescription,
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Doctor routes
router.post('/', protect, authorize('doctor'), createPrescription);
router.get('/doctor', protect, authorize('doctor'), getDoctorPrescriptions);
router.put('/:id', protect, authorize('doctor'), updatePrescription);

// Patient routes
router.get('/my', protect, authorize('patient'), getPatientPrescriptions);

// Shared (patient + doctor)
router.get('/appointment/:appointmentId', protect, getPrescriptionByAppointment);

module.exports = router;