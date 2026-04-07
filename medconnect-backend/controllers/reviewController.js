const Review = require('../models/Review');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Create a review for a doctor after completed appointment
// @route   POST /api/reviews
// @access  Private (patient only)
const createReview = async (req, res) => {
  try {
    const { doctorId, appointmentId, rating, comment } = req.body;

    // Check appointment exists and is completed
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review after a completed appointment' });
    }

    // Make sure patient owns this appointment
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this appointment' });
    }

    // Check if review already exists
    const existing = await Review.findOne({ appointment: appointmentId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this appointment' });
    }

    const review = await Review.create({
      doctor: doctorId,
      patient: req.user._id,
      appointment: appointmentId,
      rating,
      comment,
    });

    // Update doctor's average rating
    const allReviews = await Review.find({ doctor: doctorId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Doctor.findByIdAndUpdate(doctorId, {
      rating: avgRating.toFixed(1),
      totalReviews: allReviews.length,
    });

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a doctor
// @route   GET /api/reviews/doctor/:doctorId
// @access  Public
const getDoctorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ doctor: req.params.doctorId })
      .populate('patient', 'name profilePic')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews written by logged-in patient
// @route   GET /api/reviews/my
// @access  Private (patient only)
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ patient: req.user._id })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name profilePic' } })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (patient who wrote it or admin)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const isOwner = review.patient.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    // Recalculate doctor rating
    const allReviews = await Review.find({ doctor: review.doctor });
    const avgRating = allReviews.length
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

    await Doctor.findByIdAndUpdate(review.doctor, {
      rating: avgRating.toFixed(1),
      totalReviews: allReviews.length,
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getDoctorReviews,
  getMyReviews,
  deleteReview,
};

    