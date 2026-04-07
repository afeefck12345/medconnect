const express = require('express');
const router = express.Router();
const {
  createReview,
  getDoctorReviews,
  getMyReviews,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('patient'), createReview);
router.get('/my', protect, authorize('patient'), getMyReviews);
router.get('/doctor/:doctorId', getDoctorReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;