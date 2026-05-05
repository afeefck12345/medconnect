import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { getMyAppointments, bookAppointment } from '../../features/appointment/appointmentSlice'
import { getAllDoctors } from '../../features/doctor/doctorSlice'

const statusConfig = {
  pending:   { bg: '#fff8e1', color: '#f59e0b', label: 'Pending',   icon: '⏳' },
  confirmed: { bg: '#e8f5e9', color: '#2e7d32', label: 'Confirmed', icon: '✅' },
  rejected:  { bg: '#ffebee', color: '#c62828', label: 'Rejected',  icon: '❌' },
  completed: { bg: '#e3f2fd', color: '#1565c0', label: 'Completed', icon: '🎉' },
}

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']

const AppointmentsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { appointments, loading, error } = useSelector((state) => state.appointment)
  const { doctors } = useSelector((state) => state.doctor)

  const [showBooking, setShowBooking] = useState(!!location.state?.doctorId)
  const [bookingData, setBookingData] = useState({
    doctorId: location.state?.doctorId || '',
    date: '',
    timeSlot: '',
    reason: '',
  })

  useEffect(() => {
    dispatch(getMyAppointments())
    dispatch(getAllDoctors())
  }, [dispatch])

  const handleBook = async (e) => {
    e.preventDefault()
    const res = await dispatch(bookAppointment(bookingData))
    if (!res.error) {
      setShowBooking(false)
      dispatch(getMyAppointments())
    }
  }

  const statusCounts = {
    all: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  }

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
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" fill="none" stroke="#1565c0" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.09 1.18 2 2 0 012.07 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.36-.36a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            +1 800 MED-CONNECT
          </span>
        </div>
      </div>

      {/* Navbar */}
      <nav style={{ background: '#1565c0', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 12px rgba(21,101,192,0.18)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/home')}>
            <div style={{ width: 38, height: 38, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#1565c0"/>
              </svg>
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>Med<span style={{ color: '#90caf9' }}>Connect</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {['Home', 'Doctors', 'Profile'].map(item => (
              <button key={item} onClick={() => navigate(`/${item.toLowerCase()}`)}
                style={{ background: 'transparent', border: 'none', color: '#cfe2ff', fontWeight: 500, fontSize: 14, padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#cfe2ff' }}
              >{item}</button>
            ))}
            <button
              onClick={() => setShowBooking(true)}
              style={{ background: '#fff', color: '#1565c0', fontWeight: 700, fontSize: 13, padding: '9px 20px', borderRadius: 8, cursor: 'pointer', border: 'none', marginLeft: 8 }}
              onMouseEnter={e => e.currentTarget.style.background = '#e3f2fd'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              + Book Appointment
            </button>
          </div>
        </div>
      </nav>

      {/* Page Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)', padding: '48px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '40%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <p style={{ color: '#90caf9', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 10px' }}>Your Health Journey</p>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 36, margin: '0 0 12px', letterSpacing: '-0.5px' }}>My Appointments</h1>
          <p style={{ color: '#bbdefb', fontSize: 15, margin: 0 }}>Track, manage, and book your medical consultations</p>
        </div>
      </div>

      {/* Stats Strip — floats over hero */}
      <div style={{ maxWidth: 1100, margin: '-36px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Total', value: statusCounts.all, icon: '📋', color: '#1565c0', bg: '#e3f2fd' },
            { label: 'Confirmed', value: statusCounts.confirmed, icon: '✅', color: '#2e7d32', bg: '#e8f5e9' },
            { label: 'Pending', value: statusCounts.pending, icon: '⏳', color: '#f59e0b', bg: '#fff8e1' },
            { label: 'Completed', value: statusCounts.completed, icon: '🎉', color: '#1565c0', bg: '#e3f2fd' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 4px 20px rgba(21,101,192,0.08)', border: '1.5px solid #e8edf5', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <p style={{ color: s.color, fontWeight: 800, fontSize: 22, margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: '#90a4ae', fontSize: 12, margin: '3px 0 0', fontWeight: 600 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 60px' }}>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 14 }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e3f2fd', borderTop: '3px solid #1565c0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#90a4ae', fontSize: 14 }}>Loading appointments...</span>
          </div>
        ) : appointments.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '64px 32px', textAlign: 'center', boxShadow: '0 4px 20px rgba(21,101,192,0.06)', border: '1.5px solid #e8edf5' }}>
            <div style={{ width: 72, height: 72, background: '#e3f2fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>📅</div>
            <h3 style={{ color: '#1a2744', fontWeight: 700, fontSize: 20, margin: '0 0 8px' }}>No appointments yet</h3>
            <p style={{ color: '#90a4ae', fontSize: 14, margin: '0 0 28px' }}>Book your first appointment with one of our specialists</p>
            <button
              onClick={() => setShowBooking(true)}
              style={{ background: 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '13px 28px', borderRadius: 12, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(21,101,192,0.3)' }}
            >
              + Book Your First Appointment
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {appointments.map((apt) => {
              const s = statusConfig[apt.status] || { bg: '#f5f5f5', color: '#757575', label: apt.status, icon: '•' }
              return (
                <div
                  key={apt._id}
                  style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 12px rgba(21,101,192,0.05)', border: '1.5px solid #e8edf5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(21,101,192,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(21,101,192,0.05)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20, flexShrink: 0 }}>
                      {apt.doctor?.user?.name?.charAt(0)?.toUpperCase() || 'D'}
                    </div>
                    <div>
                      <p style={{ color: '#1a2744', fontWeight: 700, fontSize: 15, margin: '0 0 3px' }}>
                        Dr. {apt.doctor?.user?.name || 'Doctor'}
                      </p>
                      <p style={{ color: '#1565c0', fontSize: 12, fontWeight: 600, margin: '0 0 6px' }}>
                        {apt.doctor?.specialization || 'Specialist'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ color: '#78909c', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                          📅 {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <span style={{ color: '#78909c', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                          🕐 {apt.timeSlot}
                        </span>
                        {apt.reason && (
                          <span style={{ color: '#90a4ae', fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            💬 {apt.reason}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ background: s.bg, borderRadius: 20, padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13 }}>{s.icon}</span>
                      <span style={{ color: s.color, fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{s.label}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/doctors/${apt.doctor?._id}`)}
                      style={{ background: '#f0f4fa', color: '#546e7a', fontWeight: 600, fontSize: 12, padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#e3f2fd'; e.currentTarget.style.color = '#1565c0' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f0f4fa'; e.currentTarget.style.color = '#546e7a' }}
                    >
                      View Doctor
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,71,161,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 480, boxShadow: '0 24px 80px rgba(13,71,161,0.25)', overflow: 'hidden' }}>

            {/* Modal Header */}
            <div style={{ background: 'linear-gradient(135deg, #1565c0, #0d47a1)', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: '0 0 4px' }}>Book Appointment</h2>
                <p style={{ color: '#90caf9', fontSize: 13, margin: 0 }}>Fill in the details to confirm your visit</p>
              </div>
              <button
                onClick={() => setShowBooking(false)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 34, height: 34, borderRadius: 8, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >×</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px' }}>
              {error && (
                <div style={{ background: '#ffebee', border: '1px solid #ef9a9a', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#c62828', fontSize: 13, fontWeight: 500 }}>
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleBook}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                  {/* Doctor Select */}
                  <div>
                    <label style={{ color: '#1a2744', fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>Select Doctor</label>
                    <select
                      value={bookingData.doctorId}
                      onChange={(e) => setBookingData({ ...bookingData, doctorId: e.target.value })}
                      required
                      style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e0e7ef', borderRadius: 10, fontSize: 14, color: '#1a2744', background: '#f8faff', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="">— Select a doctor —</option>
                      {doctors.map((doc) => (
                        <option key={doc._id} value={doc._id}>
                          Dr. {doc.user?.name || 'Doctor'} — {doc.specialization}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label style={{ color: '#1a2744', fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>Appointment Date</label>
                    <input
                      type="date"
                      value={bookingData.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      required
                      style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e0e7ef', borderRadius: 10, fontSize: 14, color: '#1a2744', background: '#f8faff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label style={{ color: '#1a2744', fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 10 }}>Time Slot</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setBookingData({ ...bookingData, timeSlot: slot })}
                          style={{
                            padding: '9px 4px', borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', border: '1.5px solid',
                            background: bookingData.timeSlot === slot ? '#1565c0' : '#f8faff',
                            color: bookingData.timeSlot === slot ? '#fff' : '#455a64',
                            borderColor: bookingData.timeSlot === slot ? '#1565c0' : '#e0e7ef',
                            boxShadow: bookingData.timeSlot === slot ? '0 4px 10px rgba(21,101,192,0.25)' : 'none',
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label style={{ color: '#1a2744', fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>Reason for Visit</label>
                    <textarea
                      value={bookingData.reason}
                      onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                      placeholder="Describe your symptoms or reason for the visit..."
                      rows={3}
                      style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e0e7ef', borderRadius: 10, fontSize: 14, color: '#1a2744', background: '#f8faff', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%', background: loading ? '#90caf9' : 'linear-gradient(135deg, #1565c0, #1976d2)',
                      color: '#fff', fontWeight: 700, fontSize: 15, padding: '14px', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 16px rgba(21,101,192,0.3)', marginTop: 4, transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.9' }}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    {loading ? '⏳ Booking...' : '✅ Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
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
            {['Privacy Policy', 'Terms of Service', 'Contact'].map(link => (
              <span key={link} style={{ color: '#78909c', fontSize: 12, cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = '#90caf9'}
                onMouseLeave={e => e.target.style.color = '#78909c'}
              >{link}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default AppointmentsPage