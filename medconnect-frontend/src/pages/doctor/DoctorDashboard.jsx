import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/authSlice'
import { getMyAppointments } from '../../features/appointment/appointmentSlice'

const DoctorDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { appointments, loading } = useSelector((state) => state.appointment)

  useEffect(() => {
    dispatch(getMyAppointments())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter(
    (a) => new Date(a.date).toISOString().split('T')[0] === today
  )
  const pendingAppointments = appointments.filter((a) => a.status === 'pending')
  const completedAppointments = appointments.filter((a) => a.status === 'completed')

  const stats = [
    { label: "Today's Appointments", value: todayAppointments.length, icon: '📅', color: 'bg-blue-50 text-blue-600' },
    { label: 'Pending Requests', value: pendingAppointments.length, icon: '⏳', color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Total Appointments', value: appointments.length, icon: '🗂️', color: 'bg-green-50 text-green-600' },
    { label: 'Completed', value: completedAppointments.length, icon: '✅', color: 'bg-purple-50 text-purple-600' },
  ]

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-600',
    confirmed: 'bg-green-50 text-green-600',
    rejected: 'bg-red-50 text-red-500',
    completed: 'bg-blue-50 text-blue-600',
  }

  const navLinks = [
    { label: 'Dashboard', path: '/doctor/dashboard' },
    { label: 'Appointments', path: '/doctor/appointments' },
    { label: 'Schedule', path: '/doctor/schedule' },
    { label: 'Prescriptions', path: '/doctor/prescriptions' },
    { label: 'Profile', path: '/doctor/profile' },
  ]

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
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="text-sm text-gray-600 hover:text-green-600 transition"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="text-sm bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="bg-green-600 rounded-2xl p-8 mb-8 text-white">
          <p className="text-green-100 text-sm mb-1">Welcome back, Doctor</p>
    
            <h1 className="text-3xl font-bold mb-2">Dr. {user?.name || 'Doctor'} 👋</h1>
            {/* Use form or separate doctor state if available, or just keep safe with ?. */}
            <p className="text-green-100 mb-6">
              {user?.specialization || 'Professional Specialist'} · {user?.experience || 0} years experience
            </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/doctor/appointments')}
              className="bg-white text-green-700 font-medium px-5 py-2.5 rounded-lg text-sm hover:bg-green-50 transition"
            >
              View Appointments →
            </button>
            <button
              onClick={() => navigate('/doctor/schedule')}
              className="bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm hover:bg-green-800 transition"
            >
              Manage Schedule
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className={`text-2xl mb-3 w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Recent Appointments</h2>
            <button
              onClick={() => navigate('/doctor/appointments')}
              className="text-sm text-green-600 hover:underline"
            >
              View all →
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No appointments yet</div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 5).map((apt) => (
                <div
                  key={apt._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                      {apt.patient?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{apt.patient?.name || 'Patient'}</p>
                      <p className="text-xs text-gray-400">
                        📅 {new Date(apt.date).toLocaleDateString()} &nbsp; 🕐 {apt.timeSlot}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {apt.reason && (
                      <p className="text-xs text-gray-400 hidden md:block max-w-[160px] truncate">{apt.reason}</p>
                    )}
                    <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColors[apt.status] || 'bg-gray-100 text-gray-500'}`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Appointments', icon: '📋', path: '/doctor/appointments' },
            { label: 'Schedule', icon: '🗓️', path: '/doctor/schedule' },
            { label: 'Prescriptions', icon: '💊', path: '/doctor/prescriptions' },
            { label: 'My Profile', icon: '👤', path: '/doctor/profile' },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="bg-white border border-gray-100 rounded-xl p-5 text-center hover:border-green-300 hover:shadow-sm transition"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <p className="text-sm font-medium text-gray-700">{action.label}</p>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

export default DoctorDashboard