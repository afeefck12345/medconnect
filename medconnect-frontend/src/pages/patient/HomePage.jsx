import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllDoctors } from '../../features/doctor/doctorSlice'
import { logout } from '../../features/auth/authSlice'

const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { doctors, loading } = useSelector((state) => state.doctor)
  const [symptoms, setSymptoms] = useState('')

  useEffect(() => {
    dispatch(getAllDoctors())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const specializations = [
    { label: 'General Physician', icon: '🩺' },
    { label: 'Cardiologist', icon: '❤️' },
    { label: 'Dermatologist', icon: '🧴' },
    { label: 'Neurologist', icon: '🧠' },
    { label: 'Orthopedic', icon: '🦴' },
    { label: 'Pediatrician', icon: '👶' },
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
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/doctors')} className="text-sm text-gray-600 hover:text-green-600 transition">Doctors</button>
            <button onClick={() => navigate('/appointments')} className="text-sm text-gray-600 hover:text-green-600 transition">Appointments</button>
            <button onClick={() => navigate('/profile')} className="text-sm text-gray-600 hover:text-green-600 transition">Profile</button>
            <button onClick={handleLogout} className="text-sm bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="bg-green-600 rounded-2xl p-8 mb-8 text-white">
          <p className="text-green-100 text-sm mb-1">Welcome back,</p>
          <h1 className="text-3xl font-bold mb-2">{user?.name || 'Patient'} 👋</h1>
          <p className="text-green-100 mb-6">How are you feeling today? Let's find the right doctor for you.</p>
          <button
            onClick={() => navigate('/doctors')}
            className="bg-white text-green-700 font-medium px-5 py-2.5 rounded-lg text-sm hover:bg-green-50 transition"
          >
            Find a Doctor →
          </button>
        </div>

        {/* AI Symptom Checker */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🤖</span>
            <h2 className="text-lg font-semibold text-gray-800">AI Symptom Checker</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Powered by AI</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">Describe your symptoms and get an instant specialist recommendation</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. fever, headache, body pain..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={() => navigate('/doctors')}
              disabled={!symptoms.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Analyze
            </button>
          </div>
        </div>

        {/* Specializations */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Browse by Specialization</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {specializations.map((spec) => (
              <button
                key={spec.label}
                onClick={() => navigate('/doctors')}
                className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-green-300 hover:shadow-sm transition group"
              >
                <div className="text-2xl mb-2">{spec.icon}</div>
                <p className="text-xs text-gray-600 group-hover:text-green-600 font-medium leading-tight">{spec.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Top Doctors */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Top Doctors</h2>
            <button onClick={() => navigate('/doctors')} className="text-sm text-green-600 hover:underline">View all →</button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading doctors...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {doctors.slice(0, 6).map((doctor) => (
                <div
                  key={doctor._id}
                  onClick={() => navigate(`/doctors/${doctor._id}`)}
                  className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-green-200 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                      {doctor.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{doctor.name}</p>
                      <p className="text-xs text-gray-400">{doctor.specialization || 'General Physician'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{doctor.experience || 0} yrs exp</span>
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">⭐ {doctor.rating || '4.5'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default HomePage