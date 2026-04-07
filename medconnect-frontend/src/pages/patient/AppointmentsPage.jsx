import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { getMyAppointments, bookAppointment } from '../../features/appointment/appointmentSlice'

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-600',
  confirmed: 'bg-green-50 text-green-600',
  rejected: 'bg-red-50 text-red-500',
  completed: 'bg-blue-50 text-blue-600',
}

const AppointmentsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { appointments, loading, error } = useSelector((state) => state.appointment)
  const { doctors } = useSelector((state) => state.doctor)

  const [showBooking, setShowBooking] = useState(!!location.state?.doctorId)
  const [bookingData, setBookingData] = useState({
    doctorId: location.state?.doctorId || '',
    date: '',
    timeSlot: '',
    reason: '',
  })

  useEffect(() => {
    dispatch(getMyAppointments())
  }, [dispatch])

  const handleBook = async (e) => {
    e.preventDefault()
    await dispatch(bookAppointment(bookingData))
    setShowBooking(false)
    dispatch(getMyAppointments())
  }

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900">MedConnect</span>
          </button>
          <button
            onClick={() => setShowBooking(true)}
            className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Book Appointment
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h1>

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-800 text-lg">Book Appointment</h2>
                <button onClick={() => setShowBooking(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>

              {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Select Doctor</label>
                  <select
                    value={bookingData.doctorId}
                    onChange={(e) => setBookingData({ ...bookingData, doctorId: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">-- Select a doctor --</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>{doc.name} — {doc.specialization}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Date</label>
                  <input
                    type="date"
                    value={bookingData.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Time Slot</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, timeSlot: slot })}
                        className={`py-2 rounded-lg text-xs font-medium border transition ${
                          bookingData.timeSlot === slot
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Reason for visit</label>
                  <textarea
                    value={bookingData.reason}
                    onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                    placeholder="Describe your symptoms or reason..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2.5 rounded-lg text-sm font-medium transition"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Appointments List */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">No appointments yet</p>
            <button
              onClick={() => setShowBooking(true)}
              className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-green-700 transition"
            >
              Book your first appointment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt._id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                    {apt.doctor?.name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{apt.doctor?.name || 'Doctor'}</p>
                    <p className="text-xs text-gray-400">{apt.doctor?.specialization || 'Specialist'}</p>
                    <p className="text-xs text-gray-500 mt-1">📅 {new Date(apt.date).toLocaleDateString()} &nbsp; 🕐 {apt.timeSlot}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize ${statusColors[apt.status] || 'bg-gray-100 text-gray-500'}`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentsPage