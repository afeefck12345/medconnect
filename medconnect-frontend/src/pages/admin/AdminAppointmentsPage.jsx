import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllAppointments } from '../../features/admin/adminSlice'
import { logout } from '../../features/auth/authSlice'

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-600',
  confirmed: 'bg-green-50 text-green-600',
  rejected: 'bg-red-50 text-red-500',
  completed: 'bg-blue-50 text-blue-600',
}

const AdminAppointmentsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { appointments, loading } = useSelector((state) => state.admin)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(getAllAppointments())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const filtered = appointments
    .filter((a) => filter === 'all' || a.status === filter)
    .filter(
      (a) =>
        a.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.doctor?.name?.toLowerCase().includes(search.toLowerCase())
    )

  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    rejected: appointments.filter((a) => a.status === 'rejected').length,
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

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>
            <p className="text-sm text-gray-400 mt-1">{filtered.length} appointment{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search patient or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {Object.entries(counts).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-xl p-4 text-left border transition ${
                filter === key
                  ? 'border-green-400 bg-green-50 shadow-sm'
                  : 'border-gray-100 bg-white hover:border-green-300'
              }`}
            >
              <p className="text-xl font-bold text-gray-900">{val}</p>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{key}</p>
            </button>
          ))}
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
          <div className="text-center py-16 text-gray-400">No appointments found</div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Patient</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Doctor</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Date & Time</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Reason</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                          {apt.patient?.name?.charAt(0) || 'P'}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{apt.patient?.name || 'Patient'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                          {apt.doctor?.name?.charAt(0) || 'D'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Dr. {apt.doctor?.name || 'Doctor'}</p>
                          {apt.doctor?.specialization && (
                            <p className="text-xs text-gray-400">{apt.doctor.specialization}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700">{new Date(apt.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400">{apt.timeSlot}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-gray-500 max-w-[160px] truncate">{apt.reason || '—'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[apt.status] || 'bg-gray-100 text-gray-500'}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAppointmentsPage