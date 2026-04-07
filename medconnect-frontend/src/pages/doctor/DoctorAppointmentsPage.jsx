import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMyAppointments } from '../../features/appointment/appointmentSlice'
import { logout } from '../../features/auth/authSlice'
import API from '../../api/axios'

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-600',
  confirmed: 'bg-green-50 text-green-600',
  rejected: 'bg-red-50 text-red-500',
  completed: 'bg-blue-50 text-blue-600',
}

const DoctorAppointmentsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { appointments, loading } = useSelector((state) => state.appointment)
  const [filter, setFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    dispatch(getMyAppointments())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleStatus = async (id, status) => {
    setActionLoading(id)
    try {
      await API.put(`/appointments/${id}/status`, { status })
      dispatch(getMyAppointments())
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)

  const navLinks = [
    { label: 'Dashboard', path: '/doctor/dashboard' },
    { label: 'Appointments', path: '/doctor/appointments' },
    { label: 'Schedule', path: '/doctor/schedule' },
    { label: 'Prescriptions', path: '/doctor/prescriptions' },
    { label: 'Profile', path: '/doctor/profile' },
  ]

  navigate(`/consultation?appointmentId=${apt._id}&doctor=${apt.doctor?.name}`)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg">MedConnect</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium ml-1">Doctor</span>
          </div>
          <div className="flex items-center gap-4">
            {navLinks.map((link) => (
              <button key={link.path} onClick={() => navigate(link.path)} className="text-sm text-gray-600 hover:text-green-600 transition">{link.label}</button>
            ))}
            <button onClick={handleLogout} className="text-sm bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <span className="text-sm text-gray-400">{filtered.length} appointment{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'confirmed', 'completed', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${
                filter === tab
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-green-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading appointments...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No {filter !== 'all' ? filter : ''} appointments found</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((apt) => (
              <div key={apt._id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                      {apt.patient?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{apt.patient?.name || 'Patient'}</p>
                      <p className="text-xs text-gray-400">{apt.patient?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        📅 {new Date(apt.date).toLocaleDateString()} &nbsp; 🕐 {apt.timeSlot}
                      </p>
                      {apt.reason && (
                        <p className="text-xs text-gray-500 mt-1 bg-gray-50 px-3 py-1.5 rounded-lg">
                          💬 {apt.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-col items-end">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColors[apt.status] || 'bg-gray-100 text-gray-500'}`}>
                      {apt.status}
                    </span>
                    {apt.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleStatus(apt._id, 'confirmed')}
                          disabled={actionLoading === apt._id}
                          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                        >
                          {actionLoading === apt._id ? '...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleStatus(apt._id, 'rejected')}
                          disabled={actionLoading === apt._id}
                          className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatus(apt._id, 'completed')}
                        disabled={actionLoading === apt._id}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition mt-2 disabled:opacity-50"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorAppointmentsPage