import { useEffect, useState } from 'react'
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
    DAYS.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data } = await API.get('/doctors/profile')
        if (data?.availability) {
          const formattedSchedule = DAYS.reduce((acc, day) => {
            const dayData = data.availability.find((a) => a.day === day)
            acc[day] = dayData ? dayData.slots || [] : []
            return acc
          }, {})
          setSchedule(formattedSchedule)
        }
      } catch (err) {
        console.error('Could not fetch schedule, using defaults')
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
      const availabilityArray = Object.keys(schedule).map((day) => ({
        day,
        slots: schedule[day],
        isAvailable: schedule[day].length > 0,
      }))
      await API.post('/doctors/profile', { availability: availabilityArray })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Failed to save schedule. Check backend routes.')
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
    <div style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", background: '#f0f4fa', minHeight: '100vh' }}>

      {/* Top Info Bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8edf5', padding: '8px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#555' }}>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" fill="none" stroke="#1565c0" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              24/7 Emergency Care Available
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" fill="none" stroke="#1565c0" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              support@medconnect.com
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" fill="none" stroke="#1565c0" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.09 1.18 2 2 0 012.07 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.36-.36a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            +1 800 MED-CONNECT
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav style={{ background: '#1565c0', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 12px rgba(21,101,192,0.18)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/doctor/dashboard')}>
            <div style={{ width: 38, height: 38, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#1565c0"/>
              </svg>
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>Med<span style={{ color: '#90caf9' }}>Connect</span></span>
          </div>

          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{ background: 'transparent', border: 'none', color: '#cfe2ff', fontWeight: 500, fontSize: 14, padding: '8px 16px', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#cfe2ff' }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.1)', color: '#ffcdd2', fontWeight: 600, fontSize: 13, padding: '9px 16px', borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', marginLeft: 4, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.background = 'rgba(244,67,54,0.25)'; e.target.style.color = '#fff' }}
              onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.color = '#ffcdd2' }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)',
        padding: '48px 0 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '40%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7' }} />
            <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 600 }}>Doctor Portal</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, lineHeight: 1.2, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            Manage Your Schedule
          </h1>
          <p style={{ color: '#bbdefb', fontSize: 15, margin: 0 }}>
            Set your weekly availability slots for patient appointments
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '-32px auto 0', padding: '0 24px 64px', position: 'relative', zIndex: 10 }}>

        {/* Action Bar */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 28px', boxShadow: '0 8px 40px rgba(21,101,192,0.12)', border: '1px solid #e3f2fd', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🗓️</div>
            <div>
              <h3 style={{ color: '#1a2744', fontWeight: 700, fontSize: 16, margin: 0 }}>Weekly Availability</h3>
              <p style={{ color: '#90a4ae', fontSize: 12, margin: 0, marginTop: 2 }}>
                {Object.values(schedule).filter(s => s.length > 0).length} of {DAYS.length} days configured
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saved
                ? 'linear-gradient(135deg, #2e7d32, #388e3c)'
                : saving
                ? '#e0e0e0'
                : 'linear-gradient(135deg, #1565c0, #1976d2)',
              color: saving ? '#9e9e9e' : '#fff',
              fontWeight: 700,
              fontSize: 14,
              padding: '11px 28px',
              borderRadius: 10,
              border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: saving ? 0.7 : 1,
              boxShadow: saved || saving ? 'none' : '0 4px 16px rgba(21,101,192,0.25)',
            }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            {saving ? 'Saving...' : saved ? '✓ Saved Successfully' : 'Save Schedule'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', borderRadius: 10, padding: '12px 18px', marginBottom: 20, fontSize: 13, fontWeight: 500 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Section Label */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: '#1565c0', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.2, margin: 0, marginBottom: 4 }}>Weekly Slots</p>
          <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 22, margin: 0 }}>Select Available Time Slots</h2>
        </div>

        {/* Day Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {DAYS.map((day) => {
            const daySlots = schedule[day] || []
            const allSelected = TIME_SLOTS.every((s) => daySlots.includes(s))
            const someSelected = daySlots.length > 0 && !allSelected

            return (
              <div
                key={day}
                style={{
                  background: '#fff',
                  border: `1.5px solid ${daySlots.length > 0 ? '#1565c0' : '#e8edf5'}`,
                  borderRadius: 18,
                  padding: '24px 28px',
                  boxShadow: daySlots.length > 0
                    ? '0 4px 20px rgba(21,101,192,0.10)'
                    : '0 2px 8px rgba(21,101,192,0.04)',
                  transition: 'all 0.25s',
                }}
              >
                {/* Day Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleDay(day)}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        border: `2px solid ${allSelected ? '#1565c0' : '#b0bec5'}`,
                        background: allSelected ? '#1565c0' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      {allSelected && <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>✓</span>}
                      {someSelected && !allSelected && <span style={{ color: '#1565c0', fontSize: 14, fontWeight: 800, lineHeight: 1 }}>–</span>}
                    </button>
                    <div>
                      <span style={{ color: '#1a2744', fontWeight: 700, fontSize: 15 }}>{day}</span>
                      {daySlots.length > 0 && (
                        <span style={{ marginLeft: 10, background: '#e3f2fd', color: '#1565c0', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                          {daySlots.length} active
                        </span>
                      )}
                    </div>
                  </div>
                  {daySlots.length === 0 && (
                    <span style={{ color: '#b0bec5', fontSize: 12, fontWeight: 500 }}>No slots selected</span>
                  )}
                </div>

                {/* Time Slots */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = daySlots.includes(slot)
                    return (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(day, slot)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 10,
                          fontSize: 12,
                          fontWeight: 600,
                          border: `1.5px solid ${isSelected ? '#1565c0' : '#e8edf5'}`,
                          background: isSelected ? 'linear-gradient(135deg, #1565c0, #1976d2)' : '#f8faff',
                          color: isSelected ? '#fff' : '#546e7a',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 2px 10px rgba(21,101,192,0.22)' : 'none',
                        }}
                        onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.color = '#1565c0' } }}
                        onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.color = '#546e7a' } }}
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

      {/* Footer Strip */}
      <div style={{ background: '#1a2744', padding: '24px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#1565c0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 16 }}>❤️</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>MedConnect</span>
          </div>
          <p style={{ color: '#546e7a', fontSize: 13, margin: 0 }}>© 2025 MedConnect. Caring for your health, every step of the way.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Contact'].map((link) => (
              <span
                key={link}
                style={{ color: '#78909c', fontSize: 12, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#90caf9'}
                onMouseLeave={e => e.target.style.color = '#78909c'}
              >
                {link}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  )
}

export default DoctorSchedulePage