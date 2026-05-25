const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');
const Prescription = require('../models/Prescription');
const Notification = require('../models/Notification');

const getDoctorApprovalStatus = (doctor) => {
  if (doctor.approvalStatus) return doctor.approvalStatus;
  return doctor.isApproved ? 'approved' : 'pending';
};

const normalizeDoctorForAdmin = (doctorDoc) => {
  const doctor = typeof doctorDoc.toObject === 'function' ? doctorDoc.toObject() : doctorDoc;
  const user = doctor.user || {};

  return {
    ...doctor,
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    profilePic: user.profilePic || '',
    fee: doctor.consultationFee,
    status: getDoctorApprovalStatus(doctor),
  };
};

const normalizeAppointmentForAdmin = (appointmentDoc) => {
  const appointment = typeof appointmentDoc.toObject === 'function' ? appointmentDoc.toObject() : appointmentDoc;
  const doctorUser = appointment.doctor?.user || {};

  return {
    ...appointment,
    reason: appointment.symptoms || appointment.notes || '',
    doctor: appointment.doctor
      ? {
          ...appointment.doctor,
          name: doctorUser.name || '',
          email: doctorUser.email || '',
        }
      : appointment.doctor,
  };
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admin users cannot be deleted from this panel' });
    }

    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: user._id });
      if (doctor) {
        await Promise.all([
          Appointment.deleteMany({ doctor: doctor._id }),
          Review.deleteMany({ doctor: doctor._id }),
          Prescription.deleteMany({ doctor: doctor._id }),
          doctor.deleteOne(),
        ]);
      }
    }

    if (user.role === 'patient') {
      await Promise.all([
        Appointment.deleteMany({ patient: user._id }),
        Review.deleteMany({ patient: user._id }),
        Prescription.deleteMany({ patient: user._id }),
      ]);
    }

    await Notification.deleteMany({ recipient: user._id });
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all doctors (approved + pending)
// @route   GET /api/admin/doctors
// @access  Private (admin only)
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('user', 'name email phone profilePic')
      .sort({ createdAt: -1 });
    res.json(doctors.map(normalizeDoctorForAdmin));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a doctor
// @route   PUT /api/admin/doctors/:id/approve
// @access  Private (admin only)
const approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isApproved = true;
    doctor.approvalStatus = 'approved';
    await doctor.save();
    await User.findByIdAndUpdate(doctor.user, { isApproved: true });

    await doctor.populate('user', 'name email phone profilePic');

    res.json({ message: 'Doctor approved successfully', doctor: normalizeDoctorForAdmin(doctor) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject / disapprove a doctor
// @route   PUT /api/admin/doctors/:id/reject
// @access  Private (admin only)
const rejectDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isApproved = false;
    doctor.approvalStatus = 'rejected';
    await doctor.save();
    await User.findByIdAndUpdate(doctor.user, { isApproved: false });

    await doctor.populate('user', 'name email phone profilePic');

    res.json({ message: 'Doctor rejected', doctor: normalizeDoctorForAdmin(doctor) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (admin only)
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments();
    const approvedDoctors = await Doctor.countDocuments({
      $or: [{ approvalStatus: 'approved' }, { isApproved: true }],
    });
    const pendingDoctors = await Doctor.countDocuments({
      isApproved: false,
      $or: [{ approvalStatus: 'pending' }, { approvalStatus: { $exists: false } }],
    });
    const totalAppointments = await Appointment.countDocuments();
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const totalReviews = await Review.countDocuments();

    const start = new Date()
    start.setDate(1)
    start.setHours(0, 0, 0, 0)
    start.setMonth(start.getMonth() - 5)

    const monthlyAppointmentsRaw = await Appointment.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ])

    const monthlyRevenueRaw = await Appointment.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: start } } },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctor',
          foreignField: '_id',
          as: 'doctorProfile',
        },
      },
      { $unwind: '$doctorProfile' },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$doctorProfile.consultationFee' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ])

    const months = []
    for (let i = 0; i < 6; i += 1) {
      const date = new Date(start)
      date.setMonth(start.getMonth() + i)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const label = date.toLocaleString('default', { month: 'short' })
      const appointmentCount = monthlyAppointmentsRaw.find((entry) => entry._id.year === year && entry._id.month === month)?.count || 0
      const revenue = monthlyRevenueRaw.find((entry) => entry._id.year === year && entry._id.month === month)?.total || 0
      months.push({ label, appointmentCount, revenue })
    }

    res.json({
      totalUsers,
      totalDoctors,
      approvedDoctors,
      pendingDoctors,
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      pendingAppointments,
      totalReviews,
      monthlyStats: months,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appointments (admin view)
// @route   GET /api/admin/appointments
// @access  Private (admin only)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
      .sort({ createdAt: -1 });

    res.json(appointments.map(normalizeAppointmentForAdmin));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
  getAnalytics,
  getAllAppointments,
};
