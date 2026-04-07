const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Create or update doctor profile
// @route   POST /api/doctors/profile
// @access  Private (doctor only)
const createDoctorProfile = async (req, res) => {
  try {
    const {
      specialization, qualifications, experience,
      consultationFee, bio, clinicName, clinicAddress, availability,
    } = req.body;

    const existingDoctor = await Doctor.findOne({ user: req.user._id });

    if (existingDoctor) {
      // Update existing profile
      const updated = await Doctor.findOneAndUpdate(
        { user: req.user._id },
        { specialization, qualifications, experience, consultationFee,
          bio, clinicName, clinicAddress, availability },
        { new: true }
      ).populate('user', 'name email phone');

      return res.json({ message: 'Profile updated', doctor: updated });
    }

    // Create new profile
    const doctor = await Doctor.create({
      user: req.user._id,
      specialization, qualifications, experience,
      consultationFee, bio, clinicName, clinicAddress, availability,
    });

    res.status(201).json({ message: 'Doctor profile created', doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get own doctor profile
// @route   GET /api/doctors/profile
// @access  Private (doctor only)
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id })
      .populate('user', 'name email phone profilePic');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all approved doctors (for patients to search)
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
  try {
    const { specialization, minFee, maxFee, minRating } = req.query;

    const filter = { isApproved: true };
    if (specialization) filter.specialization = new RegExp(specialization, 'i');
    if (minFee || maxFee) {
      filter.consultationFee = {};
      if (minFee) filter.consultationFee.$gte = Number(minFee);
      if (maxFee) filter.consultationFee.$lte = Number(maxFee);
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };

    const doctors = await Doctor.find(filter)
      .populate('user', 'name email phone profilePic')
      .sort({ rating: -1 });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone profilePic');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor availability
// @route   PUT /api/doctors/availability
// @access  Private (doctor only)
const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { availability },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json({ message: 'Availability updated', availability: doctor.availability });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDoctorProfile,
  getDoctorProfile,
  getAllDoctors,
  getDoctorById,
  updateAvailability,
};