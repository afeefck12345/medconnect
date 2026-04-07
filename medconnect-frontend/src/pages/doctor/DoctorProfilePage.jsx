import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserProfile, logout } from '../../features/auth/authSlice'
import API from '../../api/axios'

const SPECIALIZATIONS = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
  'Orthopedic', 'Pediatrician', 'Gynecologist', 'Ophthalmologist',
  'ENT Specialist', 'Psychiatrist', 'Dentist', 'Radiologist',
]

const DoctorProfilePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [form, setForm] = useState({
    name: '',
    email: '',
    specialization: '',
    experience: '',
    fee: '', // We use 'fee' in the form
    phone: '',
    bio: '',
  })
  
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  // 1. Initial Load: Get User Identity
  useEffect(() => {
    dispatch(getUserProfile())
  }, [dispatch])

  // 2. Secondary Load: Fetch Doctor-specific data and merge it into the form
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (user) {
        try {
          const { data } = await API.get('/doctors/profile');
          // 'data' here is the Doctor document from your doctor collection
          setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            specialization: data.specialization || '',
            experience: data.experience || '',
            fee: data.consultationFee || '', // Mapping DB 'consultationFee' to form 'fee'
            bio: data.bio || '',
          });
        } catch (err) {
          console.log("No specific doctor profile found, using user defaults");
          setForm(prev => ({ ...prev, name: user.name, email: user.email, phone: user.phone }));
        }
      }
    };
    fetchDoctorDetails();
  }, [user])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      // FIX: Mapping the form field 'fee' back to 'consultationFee' for the Backend
      const payload = {
        ...form,
        consultationFee: Number(form.fee),
        experience: Number(form.experience)
      }

      await API.post('/doctors/profile', payload) // Using POST as per your controller logic for create/update
      
      // Refresh user data in Redux
      dispatch(getUserProfile())
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const navLinks = [
    { label: 'Dashboard', path: '/doctor/dashboard' },
    { label: 'Appointments', path: '/doctor/appointments' },
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
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium ml-1">Doctor Portal</span>
          </div>
          <div className="flex items-center gap-4">
            {navLinks.map((link) => (
              <button key={link.path} onClick={() => navigate(link.path)} className="text-sm text-gray-600 hover:text-green-600 transition">{link.label}</button>
            ))}
            <button onClick={handleLogout} className="text-sm bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl">
              {user?.name?.charAt(0)?.toUpperCase() || 'D'}
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Dr. {user?.name}</h2>
              <p className="text-sm text-gray-400">{form.specialization || 'Setup your specialization'}</p>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
          {saved && <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">✓ Profile saved successfully</div>}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Email (Read Only)</label>
                <input type="email" value={form.email} disabled className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-400 cursor-not-allowed" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Specialization</label>
                <select
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select specialization</option>
                  {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Consultation Fee (₹)</label>
                <input
                  type="number"
                  value={form.fee}
                  onChange={(e) => setForm({ ...form, fee: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">About / Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfilePage

