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

  // ✅ FIX: AI Logic to map symptoms to specializations
  const handleAnalyze = () => {
    const input = symptoms.toLowerCase();
    let specialty = 'General Physician';

    if (input.includes('heart') || input.includes('chest')) specialty = 'Cardiologist';
    else if (input.includes('skin') || input.includes('rash')) specialty = 'Dermatologist';
    else if (input.includes('brain') || input.includes('headache')) specialty = 'Neurologist';
    else if (input.includes('bone') || input.includes('joint')) specialty = 'Orthopedic';
    else if (input.includes('kid') || input.includes('child')) specialty = 'Pediatrician';

    // Navigate and pass the filter to DoctorsPage
    navigate('/doctors', { state: { suggestedSpecialty: specialty } });
  };

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
          <div className="flex items-center gap-4 text-sm font-medium">
            {['Doctors', 'Appointments', 'Profile'].map(item => (
              <button key={item} onClick={() => navigate(`/${item.toLowerCase()}`)} className="text-gray-600 hover:text-green-600 transition">{item}</button>
            ))}
            <button onClick={handleLogout} className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-green-600 rounded-2xl p-8 mb-8 text-white shadow-lg shadow-green-100">
          <p className="text-green-100 text-sm mb-1 font-medium">Welcome back,</p>
          <h1 className="text-3xl font-bold mb-2">{user?.name || 'Patient'} 👋</h1>
          <p className="text-green-100 mb-6">Let's find the right specialist for your health needs today.</p>
          <button onClick={() => navigate('/doctors')} className="bg-white text-green-700 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-green-50 transition shadow-sm">
            Find a Doctor →
          </button>
        </div>

        {/* AI Symptom Checker */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🤖</span>
            <h2 className="text-lg font-bold text-gray-800">AI Symptom Checker</h2>
          </div>
          <p className="text-gray-400 text-sm mb-4">Describe how you feel to get a recommendation.</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. persistent headache and blurred vision..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition"
            />
            <button
              onClick={handleAnalyze}
              disabled={!symptoms.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-400 text-white px-6 py-3 rounded-xl text-sm font-bold transition active:scale-95"
            >
              Analyze
            </button>
          </div>
        </div>

        {/* Specializations - ✅ FIXED Navigation with Filter */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-5">Browse by Specialization</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {specializations.map((spec) => (
              <button
                key={spec.label}
                onClick={() => navigate('/doctors', { state: { suggestedSpecialty: spec.label } })}
                className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:border-green-300 hover:shadow-md transition group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{spec.icon}</div>
                <p className="text-xs text-gray-600 group-hover:text-green-600 font-bold">{spec.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Top Doctors - ✅ FIXED Nested Data Naming */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-800">Top Rated Specialists</h2>
            <button onClick={() => navigate('/doctors')} className="text-sm text-green-600 font-bold hover:underline">View all</button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {doctors.slice(0, 3).map((doctor) => (
                <div
                  key={doctor._id}
                  onClick={() => navigate(`/doctors/${doctor._id}`)}
                  className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xl hover:border-green-100 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-700 font-bold text-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                      {(doctor.user?.name || doctor.name || 'D').charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Dr. {doctor.user?.name || doctor.name}</p>
                      <p className="text-xs text-green-600 font-medium">{doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xs text-gray-400 font-medium">{doctor.experience || 5}+ yrs exp</span>
                    <span className="text-sm font-bold text-gray-700 flex items-center gap-1">⭐ {doctor.rating || '4.9'}</span>
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