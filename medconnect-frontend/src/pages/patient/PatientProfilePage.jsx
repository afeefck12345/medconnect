import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserProfile, logout } from '../../features/auth/authSlice'

const PatientProfilePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    dispatch(getUserProfile())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="text-gray-400 hover:text-gray-600 text-sm transition">
            ← Home
          </button>
          <span className="font-semibold text-gray-800">My Profile</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600">Logout</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Profile Header */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-3xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium capitalize">
                {user?.role}
              </span>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="text-sm border border-gray-200 px-4 py-2 rounded-lg text-gray-600 hover:border-green-400 hover:text-green-600 transition"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">
          <h2 className="font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div className="space-y-4">
            {[
              { label: 'Full Name', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'Phone', value: user?.phone || 'Not provided' },
              { label: 'Date of Birth', value: user?.dob || 'Not provided' },
              { label: 'Blood Group', value: user?.bloodGroup || 'Not provided' },
              { label: 'Address', value: user?.address || 'Not provided' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-400">{item.label}</span>
                <span className="text-sm font-medium text-gray-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Quick Links</h2>
          <div className="space-y-2">
            {[
              { label: '📅 My Appointments', path: '/appointments' },
              { label: '🩺 Find Doctors', path: '/doctors' },
              { label: '🏠 Home', path: '/home' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full text-left px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-green-50 hover:text-green-700 transition"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default PatientProfilePage