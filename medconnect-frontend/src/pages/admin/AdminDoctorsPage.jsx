import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllDoctors, approveDoctor, rejectDoctor } from '../../features/admin/adminSlice'
import { logout } from '../../features/auth/authSlice'

const AdminDoctorsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { doctors, loading } = useSelector((state) => state.admin)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    dispatch(getAllDoctors())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleApprove = async (id) => {
    setActionLoading(id + '_approve')
    await dispatch(approveDoctor(id))
    setActionLoading(null)
  }

  const handleReject = async (id) => {
    setActionLoading(id + '_reject')
    await dispatch(rejectDoctor(id))
    setActionLoading(null)
  }

  const statusColors = {
    approved: 'bg-green-50 text-green-600',
    pending: 'bg-yellow-50 text-yellow-600',
    rejected: 'bg-red-50 text-red-500',
  }

  const filtered = doctors
    .filter((d) => filter === 'all' || d.status === filter)
    .filter(
      (d) =>
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(search.toLowerCase())
    )

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
            <p className="text-sm text-gray-400 mt-1">{filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found</p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-72"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'approved', 'rejected'].map((tab) => (
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
              {tab === 'pending' && doctors.filter((d) => d.status === 'pending').length > 0 && (
                <span className="ml-1.5 bg-yellow-400 text-white text-xs rounded-full px-1.5 py-0.5">
                  {doctors.filter((d) => d.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading doctors...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No doctors found</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((doctor) => (
              <div key={doctor._id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                      {doctor.name?.charAt(0)?.toUpperCase() || 'D'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">Dr. {doctor.name}</p>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${statusColors[doctor.status] || 'bg-gray-100 text-gray-500'}`}>
                          {doctor.status || 'pending'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{doctor.email}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        {doctor.specialization && (
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{doctor.specialization}</span>
                        )}
                        {doctor.experience && (
                          <span className="text-xs text-gray-400">{doctor.experience} yrs exp</span>
                        )}
                        {doctor.fee && (
                          <span className="text-xs text-gray-400">₹{doctor.fee}/consult</span>
                        )}
                      </div>
                      {doctor.bio && (
                        <p className="text-xs text-gray-400 mt-2 max-w-lg line-clamp-2">{doctor.bio}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {(!doctor.status || doctor.status === 'pending') && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(doctor._id)}
                          disabled={actionLoading === doctor._id + '_approve'}
                          className="text-xs bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                        >
                          {actionLoading === doctor._id + '_approve' ? '...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(doctor._id)}
                          disabled={actionLoading === doctor._id + '_reject'}
                          className="text-xs bg-red-50 text-red-500 px-4 py-1.5 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                        >
                          {actionLoading === doctor._id + '_reject' ? '...' : 'Reject'}
                        </button>
                      </div>
                    )}
                    {doctor.status === 'approved' && (
                      <button
                        onClick={() => handleReject(doctor._id)}
                        disabled={actionLoading === doctor._id + '_reject'}
                        className="text-xs bg-red-50 text-red-500 px-4 py-1.5 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                      >
                        Revoke
                      </button>
                    )}
                    {doctor.status === 'rejected' && (
                      <button
                        onClick={() => handleApprove(doctor._id)}
                        disabled={actionLoading === doctor._id + '_approve'}
                        className="text-xs bg-green-50 text-green-600 px-4 py-1.5 rounded-lg hover:bg-green-100 transition disabled:opacity-50"
                      >
                        Re-approve
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

export default AdminDoctorsPage