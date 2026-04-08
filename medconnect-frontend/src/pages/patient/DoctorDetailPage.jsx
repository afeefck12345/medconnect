import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getDoctorById } from '../../features/doctor/doctorSlice'

const DoctorDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedDoctor: doctor, loading } = useSelector((state) => state.doctor)

  useEffect(() => {
    dispatch(getDoctorById(id))
  }, [dispatch, id])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  if (!doctor) return <div className="min-h-screen flex items-center justify-center text-gray-400">Doctor not found</div>

  // ✅ FIX: Correctly resolve doctor name from nested user object
  const doctorName = doctor.user?.name || doctor.name || 'Doctor'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/doctors')} className="text-gray-400 hover:text-gray-600 transition">
            ← Back
          </button>
          <span className="text-gray-300">|</span>
          <span className="font-semibold text-gray-800 text-sm">Doctor Profile</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left — Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
              {/* ✅ FIX: Use resolved doctorName variable for avatar initial */}
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-3xl mx-auto mb-4">
                {doctorName.charAt(0).toUpperCase()}
              </div>
              {/* ✅ FIX: Use resolved doctorName variable for display */}
              <h2 className="font-bold text-gray-900 text-lg">{doctorName}</h2>
              <p className="text-green-600 text-sm font-medium">{doctor.specialization || 'General Physician'}</p>
              <p className="text-gray-400 text-xs mt-1">{doctor.experience || 0} years experience</p>

              <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-50">
                <div className="text-center">
                  <p className="font-bold text-gray-900">⭐ {doctor.rating || '4.5'}</p>
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">{doctor.totalReviews || 0}</p>
                  <p className="text-xs text-gray-400">Reviews</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">{doctor.patients || 0}+</p>
                  <p className="text-xs text-gray-400">Patients</p>
                </div>
              </div>

              <div className="mt-4 text-left">
                <p className="text-xs text-gray-400 mb-1">Consultation Fee</p>
                <p className="text-xl font-bold text-green-600">₹{doctor.fee || '500'}</p>
              </div>
            </div>
          </div>

          {/* Right — Details + Booking */}
          <div className="md:col-span-2 space-y-5">

            {/* About */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">About</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {/* ✅ FIX: Use doctorName in fallback bio text */}
                {doctor.bio || `Dr. ${doctorName} is a highly experienced ${doctor.specialization || 'physician'} with ${doctor.experience || 0} years of practice. Committed to providing quality healthcare to all patients.`}
              </p>
            </div>

            {/* Availability */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Availability</h3>
              <div className="flex flex-wrap gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                  <span key={day} className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-lg">{day}</span>
                ))}
                {['Sat', 'Sun'].map((day) => (
                  <span key={day} className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs rounded-lg">{day}</span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Timings: 9:00 AM – 6:00 PM</p>
            </div>

            {/* Book Appointment */}
            <div className="bg-green-600 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-1">Ready to consult?</h3>
              <p className="text-green-100 text-sm mb-4">Book your appointment now and get quality care</p>
              <button
                onClick={() => navigate('/appointments', { state: { doctorId: doctor._id } })}
                className="w-full bg-white text-green-700 font-semibold py-2.5 rounded-xl hover:bg-green-50 transition text-sm"
              >
                Book Appointment
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetailPage