const express = require('express');
const router = express.Router();
const {
  sendAppointmentConfirmation,
  sendReminder,
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyNotifications);
router.put('/read-all', protect, markAllNotificationsRead);
router.put('/:id/read', protect, markNotificationRead);
router.post('/appointment-confirm', protect, sendAppointmentConfirmation);
router.post('/reminder', protect, sendReminder);

module.exports = router;