import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout, getUserProfile } from '../../features/auth/authSlice'
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

  // Initialize schedule as an object where each day is an empty array
  const [schedule, setSchedule] = useState(
    DAYS.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  // Fetch the actual doctor profile (which contains availability) on mount
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data } = await API.get('/doctors/profile')
        if (data?.availability) {
          // Convert the Array from DB into the Object format the UI uses
          const formattedSchedule = DAYS.reduce((acc, day) => {
            const dayData = data.availability.find((a) => a.day === day)
            acc[day] = dayData ? dayData.slots || [] : []
            return acc
          }, {})
          setSchedule(formattedSchedule)
        }
      } catch (err) {
        console.error("Could not fetch schedule, using defaults")
      }
    }
    fetchSchedule()
  }, [])

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
    setError(null)
    try {
      // Transform our state object back into the array format the Backend expects
      const availabilityArray = Object.keys(schedule).map(day => ({
        day,
        slots: schedule[day],
        isAvailable: schedule[day].length > 0
      }))

      await API.post('/doctors/profile', { availability: availabilityArray })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError("Failed to save schedule. Check backend routes.")
    } finally {
      setSaving(false)
    }
  }

  const navLinks = [
    { label: 'Dashboard', path: '/doctor/dashboard' },
    { label: 'Appointments', path: '/doctor/appointments' },
    { label: 'Schedule', path: '/doctor/schedule' },
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg">MedConnect</span>
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
            <p className="text-sm text-gray-400 mt-1">Set your weekly availability slots</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              saved ? 'bg-green-100 text-green-700' : 'bg-green-600 text-white hover:bg-green-700'
            } disabled:opacity-50`}
          >
            {saving ? 'Saving...' : saved ? '✓ Saved Successfully' : 'Save Schedule'}
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

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
                      {allSelected && <span className="text-white text-[10px]">✓</span>}
                    </button>
                    <h3 className="font-semibold text-gray-800">{day}</h3>
                  </div>
                  <span className="text-xs text-gray-400">{daySlots.length} slots active</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = daySlots.includes(slot)
                    return (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(day, slot)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          isSelected ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
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