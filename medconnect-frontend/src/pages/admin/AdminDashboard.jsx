import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAnalytics, getAllAppointments } from '../../features/admin/adminSlice'
import { logout } from '../../features/auth/authSlice'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { analytics, appointments, loading } = useSelector((state) => state.admin)

  useEffect(() => {
    dispatch(getAnalytics())
    dispatch(getAllAppointments())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const stats = [
    { label: 'Total Users', value: analytics?.totalUsers || 0, icon: '👥', color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Doctors', value: analytics?.totalDoctors || 0, icon: '🩺', color: 'bg-green-50 text-green-600' },
    { label: 'Total Appointments', value: analytics?.totalAppointments || 0, icon: '📅', color: 'bg-purple-50 text-purple-600' },
    { label: 'Pending Approvals', value: analytics?.pendingDoctors || 0, icon: '⏳', color: 'bg-yellow-50 text-yellow-600' },
  ]

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-600',
    confirmed: 'bg-green-50 text-green-600',
    rejected: 'bg-red-50 text-red-500',
    completed: 'bg-blue-50 text-blue-600',
  }

  const navLinks = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Doctors', path: '/admin/doctors' },
    { label: 'Appointments', path: '/admin/appointments' },
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
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium ml-1">Admin</span>
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

        {/* Hero */}
        <div className="bg-green-600 rounded-2xl p-8 mb-8 text-white">
          <p className="text-green-100 text-sm mb-1">Admin Panel</p>
          <h1 className="text-3xl font-bold mb-2">MedConnect Dashboard 🛡️</h1>
          <p className="text-green-100 mb-6">Manage users, doctors, and appointments from one place.</p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/admin/doctors')} className="bg-white text-green-700 font-medium px-5 py-2.5 rounded-lg text-sm hover:bg-green-50 transition">
              Review Doctors →
            </button>
            <button onClick={() => navigate('/admin/users')} className="bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm hover:bg-green-800 transition">
              Manage Users
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className={`text-xl mb-3 w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Manage Users', icon: '👥', path: '/admin/users', desc: 'View & delete users' },
            { label: 'Approve Doctors', icon: '🩺', path: '/admin/doctors', desc: 'Review doctor registrations' },
            { label: 'All Appointments', icon: '📋', path: '/admin/appointments', desc: 'Monitor all bookings' },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="bg-white border border-gray-100 rounded-xl p-5 text-left hover:border-green-300 hover:shadow-sm transition"
            >
              <div className="text-2xl mb-3">{action.icon}</div>
              <p className="font-semibold text-gray-800 text-sm">{action.label}</p>
              <p className="text-xs text-gray-400 mt-1">{action.desc}</p>
            </button>
          ))}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Recent Appointments</h2>
            <button onClick={() => navigate('/admin/appointments')} className="text-sm text-green-600 hover:underline">View all →</button>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No appointments yet</div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 6).map((apt) => (
                <div key={apt._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                      {apt.patient?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{apt.patient?.name || 'Patient'}</p>
                      <p className="text-xs text-gray-400">
                        Dr. {apt.doctor?.name || 'Doctor'} · {new Date(apt.date).toLocaleDateString()} · {apt.timeSlot}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColors[apt.status] || 'bg-gray-100 text-gray-500'}`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard