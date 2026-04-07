const express = require('express');
const router = express.Router();
const {
  sendAppointmentConfirmation,
  sendReminder,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/appointment-confirm', protect, sendAppointmentConfirmation);
router.post('/reminder', protect, sendReminder);

module.exports = router;