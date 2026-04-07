const express = require('express');
const router = express.Router();
const {
  createDoctorProfile,
  getDoctorProfile,
  getAllDoctors,
  getDoctorById,
  updateAvailability,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ✅ Specific routes FIRST (before /:id)
router.post('/profile', protect, authorize('doctor'), createDoctorProfile);
router.get('/profile/me', protect, authorize('doctor'), getDoctorProfile);
router.put('/availability', protect, authorize('doctor'), updateAvailability);

// Public routes AFTER
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById); // ✅ dynamic route LAST
module.exports = router; 