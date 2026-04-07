import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/authSlice'
import API from '../../api/axios'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM',
]

const DoctorSchedulePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [schedule, setSchedule] = useState(
    user?.schedule || DAYS.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const toggleSlot = (day, slot) => {
    setSchedule((prev) => {
      const daySlots = prev[day] || []
      const exists = daySlots.includes(slot)
      return {
        ...prev,
        [day]: exists ? daySlots.filter((s) => s !== slot) : [...daySlots, slot],
      }
    })
    setSaved(false)
  }

  const toggleDay = (day) => {
    setSchedule((prev) => {
      const allSelected = TIME_SLOTS.every((s) => (prev[day] || []).includes(s))
      return { ...prev, [day]: allSelected ? [] : [...TIME_SLOTS] }
    })
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await API.put('/doctors/schedule', { schedule })
      setSaved(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
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
              <button key={link.path} onClick={() => navigate(link.path)} className="text-sm text-gray-600 hover:text-green-600 transition">{link.label}</button>
            ))}
            <button onClick={handleLogout} className="text-sm bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Schedule</h1>
            <p className="text-sm text-gray-400 mt-1">Select your available days and time slots</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              saved
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-green-600 text-white hover:bg-green-700'
            } disabled:opacity-50`}
          >
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Schedule'}
          </button>
        </div>

        <div className="space-y-4">
          {DAYS.map((day) => {
            const daySlots = schedule[day] || []
            const allSelected = TIME_SLOTS.every((s) => daySlots.includes(s))
            return (
              <div key={day} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleDay(day)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                        allSelected ? 'bg-green-600 border-green-600' : 'border-gray-300'
                      }`}
                    >
                      {allSelected && <span className="text-white text-xs">✓</span>}
                    </button>
                    <h3 className="font-semibold text-gray-800">{day}</h3>
                  </div>
                  <span className="text-xs text-gray-400">
                    {daySlots.length} slot{daySlots.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const selected = daySlots.includes(slot)
                    return (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(day, slot)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          selected
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                        }`}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DoctorSchedulePage