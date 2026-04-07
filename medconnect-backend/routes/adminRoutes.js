const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
  getAnalytics,
  getAllAppointments,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes are protected
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

router.get('/doctors', getAllDoctors);
router.put('/doctors/:id/approve', approveDoctor);
router.put('/doctors/:id/reject', rejectDoctor);

router.get('/analytics', getAnalytics);
router.get('/appointments', getAllAppointments);

module.exports = router;