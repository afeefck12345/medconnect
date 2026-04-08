import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom' // ✅ FIX: Added useLocation
import { getAllDoctors } from '../../features/doctor/doctorSlice'

const specializations = ['All', 'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic', 'Pediatrician']

const DoctorsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation() // ✅ FIX: Read location state
  const { doctors, loading } = useSelector((state) => state.doctor)
  const [search, setSearch] = useState('')

  // ✅ FIX: Auto-apply specialty filter when navigated from HomePage or AI Symptom Checker
  const [selectedSpec, setSelectedSpec] = useState(
    location.state?.suggestedSpecialty || 'All'
  )

  useEffect(() => {
    dispatch(getAllDoctors())
  }, [dispatch])

  // ✅ FIX: Also update filter if location state changes (e.g. navigating again from home)
  useEffect(() => {
    if (location.state?.suggestedSpecialty) {
      setSelectedSpec(location.state.suggestedSpecialty)
    }
  }, [location.state])

  const filtered = (Array.isArray(doctors) ? doctors : []).filter((doc) => {
    const doctorName = doc.user?.name || ''
    const matchSearch = doctorName.toLowerCase().includes(search.toLowerCase())
    const matchSpec = selectedSpec === 'All' || doc.specialization === selectedSpec
    return matchSearch && matchSpec
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg">MedConnect</span>
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/appointments')} className="text-sm text-gray-600 hover:text-green-600">Appointments</button>
            <button onClick={() => navigate('/profile')} className="text-sm text-gray-600 hover:text-green-600">Profile</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>
          <p className="text-gray-400 text-sm mt-1">Browse and book appointments with top specialists</p>
        </div>

        {/* ✅ FIX: Show banner when a specialty is pre-selected from navigation */}
        {location.state?.suggestedSpecialty && selectedSpec !== 'All' && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
            <p className="text-sm text-green-700 font-medium">
              🤖 Showing results for: <span className="font-bold">{selectedSpec}</span>
            </p>
            <button
              onClick={() => setSelectedSpec('All')}
              className="text-xs text-green-600 hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Search */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-5 shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor name..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Specialization Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpec(spec)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition border ${
                selectedSpec === spec
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading doctors...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No doctors found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-green-200 transition cursor-pointer"
                onClick={() => navigate(`/doctors/${doctor._id}`)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl flex-shrink-0">
                    {doctor.user?.name?.charAt(0).toUpperCase() || 'D'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{doctor.user?.name || 'Doctor'}</p>
                    <p className="text-xs text-green-600 font-medium">{doctor.specialization || 'General Physician'}</p>
                    <p className="text-xs text-gray-400">{doctor.experience || 0} years experience</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className="text-xs font-medium text-gray-700">{doctor.rating || '4.5'}</span>
                    <span className="text-xs text-gray-400">({doctor.totalReviews || 0} reviews)</span>
                  </div>
                  <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorsPage