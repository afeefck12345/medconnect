const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getPaymentStatus,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create-order', protect, authorize('patient'), createOrder);
router.post('/verify', protect, authorize('patient'), verifyPayment);
router.get('/:appointmentId', protect, getPaymentStatus);

module.exports = router;