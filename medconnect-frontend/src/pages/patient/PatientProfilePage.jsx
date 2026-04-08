import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserProfile, logout, updateUserProfile } from '../../features/auth/authSlice'

const PatientProfilePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // ✅ FIX: Also read error from Redux state to display save errors
  const { user, loading, error } = useSelector((state) => state.auth)

  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    bloodGroup: '',
    address: ''
  })

  // ✅ FIX: Local success message state for better UX feedback
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    dispatch(getUserProfile())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        dob: user.dob || '',
        bloodGroup: user.bloodGroup || '',
        address: user.address || ''
      })
    }
  }, [user])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaveSuccess(false)
    const result = await dispatch(updateUserProfile(formData))
    if (updateUserProfile.fulfilled.match(result)) {
      setEditing(false)
      setSaveSuccess(true)
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  // ✅ FIX: Reset success/error state when editing starts
  const handleEditToggle = () => {
    setSaveSuccess(false)
    setEditing(!editing)
  }

  const profileFields = [
    { label: 'Full Name', key: 'name', type: 'text' },
    { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
    { label: 'Date of Birth', key: 'dob', type: 'date' },
    { label: 'Blood Group', key: 'bloodGroup', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    { label: 'Address', key: 'address', type: 'textarea' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
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

        {/* ✅ FIX: Global success message shown after save */}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Profile updated successfully!
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-3xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
            {/* ✅ FIX: Use handleEditToggle to also reset feedback states */}
            <button
              onClick={handleEditToggle}
              className={`text-sm px-4 py-2 rounded-lg transition ${
                editing ? 'bg-gray-100 text-gray-600' : 'border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600'
              }`}
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">
          <h2 className="font-semibold text-gray-800 mb-4">Personal Information</h2>

          {/* ✅ FIX: Show API error if updateUserProfile fails */}
          {editing && error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {profileFields.map((field) => (
              <div key={field.key} className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-50 last:border-0 gap-2">
                <label className="text-sm text-gray-400 min-w-[150px]">{field.label}</label>

                {editing ? (
                  field.type === 'select' ? (
                    <select
                      className="w-full md:w-2/3 p-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-green-500 outline-none"
                      value={formData[field.key]}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      className="w-full md:w-2/3 p-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-green-500 outline-none"
                      rows="2"
                      value={formData[field.key]}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    />
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full md:w-2/3 p-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-green-500 outline-none"
                      value={formData[field.key]}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    />
                  )
                ) : (
                  <span className="text-sm font-medium text-gray-700">
                    {field.key === 'dob' && user?.[field.key]
                      ? new Date(user[field.key]).toLocaleDateString()
                      : (user?.[field.key] || 'Not provided')}
                  </span>
                )}
              </div>
            ))}

            {editing && (
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-green-300"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Quick Links */}
        {!editing && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {[
                { label: '📅 My Appointments', path: '/appointments' },
                { label: '🩺 Find Doctors', path: '/doctors' },
                { label: '🏠 Home', path: '/home' },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="text-center px-4 py-3 rounded-lg text-sm text-gray-600 bg-gray-50 hover:bg-green-50 hover:text-green-700 transition"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientProfilePage