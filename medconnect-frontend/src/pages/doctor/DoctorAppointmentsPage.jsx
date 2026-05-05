import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMyAppointments } from '../../features/appointment/appointmentSlice'
import { logout } from '../../features/auth/authSlice'
import API from '../../api/axios'

const statusConfig = {
  pending:   { bg: '#fff8e1', color: '#f59e0b', label: 'Pending' },
  confirmed: { bg: '#e8f5e9', color: '#2e7d32', label: 'Confirmed' },
  rejected:  { bg: '#ffebee', color: '#c62828', label: 'Rejected' },
  completed: { bg: '#e3f2fd', color: '#1565c0', label: 'Completed' },
}

const DoctorAppointmentsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { appointments, loading } = useSelector((state) => state.appointment)
  const [filter, setFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    dispatch(getMyAppointments())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleStatus = async (id, status) => {
    setActionLoading(id)
    try {
      await API.put(`/appointments/${id}/status`, { status })
      await dispatch(getMyAppointments())
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update status.')
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = (appointments || []).filter((a) =>
    filter === 'all' ? true : a.status === filter
  )

  const navLinks = [
    { label: 'Dashboard',     path: '/doctor/dashboard' },
    { label: 'Appointments',  path: '/doctor/appointments' },
    { label: 'Schedule',      path: '/doctor/schedule' },
    { label: 'Prescriptions', path: '/doctor/prescriptions' },
    { label: 'Profile',       path: '/doctor/profile' },
  ]

  const tabCounts = ['all', 'pending', 'confirmed', 'completed', 'rejected'].map((t) => ({
    key: t,
    count: t === 'all' ? (appointments || []).length : (appointments || []).filter((a) => a.status === t).length,
  }))

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
            <div>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>Med<span style={{ color: '#90caf9' }}>Connect</span></span>
              <span style={{ display: 'block', color: '#90caf9', fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', lineHeight: 1 }}>Doctor Portal</span>
            </div>
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
              style={{ background: 'rgba(255,255,255,0.1)', color: '#ffcdd2', fontWeight: 600, fontSize: 13, padding: '9px 16px', borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', marginLeft: 8, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.background = 'rgba(244,67,54,0.25)'; e.target.style.color = '#fff' }}
              onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.color = '#ffcdd2' }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Hero / Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)',
        padding: '48px 0 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: 20, left: '60%', width: 150, height: 150, borderRadius: '50%', background: 'rgba(144,202,249,0.1)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 600 }}>Doctor Portal</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.5px' }}>
            Appointment Management
          </h1>
          <p style={{ color: '#bbdefb', fontSize: 15, margin: 0 }}>
            Review, accept, and manage your patient appointments below.
          </p>
        </div>
      </div>

      {/* Stats Strip — floating over hero */}
      <div style={{ maxWidth: 1200, margin: '-32px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 32px', boxShadow: '0 8px 40px rgba(21,101,192,0.12)', border: '1px solid #e3f2fd', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[
            { label: 'Total',     value: (appointments || []).length,                                       icon: '📋' },
            { label: 'Pending',   value: (appointments || []).filter(a => a.status === 'pending').length,   icon: '⏳' },
            { label: 'Confirmed', value: (appointments || []).filter(a => a.status === 'confirmed').length, icon: '✅' },
            { label: 'Completed', value: (appointments || []).filter(a => a.status === 'completed').length, icon: '🏁' },
          ].map((stat, i, arr) => (
            <div key={stat.label} style={{ textAlign: 'center', padding: '8px 0', borderRight: i < arr.length - 1 ? '1px solid #e8edf5' : 'none' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ color: '#1a2744', fontWeight: 800, fontSize: 22 }}>{stat.value}</div>
              <div style={{ color: '#90a4ae', fontSize: 12, fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 64px' }}>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <p style={{ color: '#1565c0', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.2, margin: 0, marginBottom: 6 }}>Filter by Status</p>
            <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 22, margin: 0 }}>
              {filter === 'all' ? 'All Appointments' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
              <span style={{ color: '#90a4ae', fontWeight: 500, fontSize: 15, marginLeft: 10 }}>{filtered.length} records</span>
            </h2>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tabCounts.map(({ key, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: filter === key ? 'none' : '1.5px solid #e8edf5',
                  background: filter === key ? 'linear-gradient(135deg, #1565c0, #1976d2)' : '#fff',
                  color: filter === key ? '#fff' : '#546e7a',
                  boxShadow: filter === key ? '0 4px 14px rgba(21,101,192,0.25)' : 'none',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize',
                }}
                onMouseEnter={e => { if (filter !== key) { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.color = '#1565c0' } }}
                onMouseLeave={e => { if (filter !== key) { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.color = '#546e7a' } }}
              >
                {key} {count > 0 && <span style={{ opacity: 0.75, fontSize: 11 }}>({count})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0', gap: 12 }}>
            <div style={{ width: 36, height: 36, border: '3px solid #e3f2fd', borderTop: '3px solid #1565c0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#90a4ae', fontSize: 14 }}>Loading appointments...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p style={{ color: '#90a4ae', fontSize: 15, fontWeight: 500 }}>No appointments found for this filter.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map((apt) => {
              const sc = statusConfig[apt.status] || { bg: '#f5f5f5', color: '#757575', label: apt.status }
              return (
                <div
                  key={apt._id}
                  style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(21,101,192,0.05)', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(21,101,192,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(21,101,192,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>

                      {/* Patient Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 22, flexShrink: 0, boxShadow: '0 4px 14px rgba(21,101,192,0.25)' }}>
                          {apt.patient?.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <p style={{ color: '#1a2744', fontWeight: 800, fontSize: 16, margin: 0 }}>{apt.patient?.name || 'Patient'}</p>
                          <p style={{ color: '#90a4ae', fontSize: 12, margin: '3px 0 0' }}>{apt.patient?.email}</p>
                          <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#546e7a', fontSize: 12, fontWeight: 500 }}>
                              📅 {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#546e7a', fontSize: 12, fontWeight: 500 }}>
                              🕐 {apt.timeSlot}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status + Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                        <span style={{ background: sc.bg, color: sc.color, fontWeight: 700, fontSize: 12, padding: '5px 14px', borderRadius: 20, textTransform: 'capitalize', letterSpacing: 0.3 }}>
                          {sc.label}
                        </span>

                        {apt.status === 'pending' && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => handleStatus(apt._id, 'confirmed')}
                              disabled={actionLoading === apt._id}
                              style={{ background: 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 12, padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', opacity: actionLoading === apt._id ? 0.6 : 1, transition: 'all 0.2s' }}
                              onMouseEnter={e => { if (actionLoading !== apt._id) e.currentTarget.style.opacity = '0.88' }}
                              onMouseLeave={e => { e.currentTarget.style.opacity = actionLoading === apt._id ? '0.6' : '1' }}
                            >
                              {actionLoading === apt._id ? 'Updating...' : '✓ Accept'}
                            </button>
                            <button
                              onClick={() => handleStatus(apt._id, 'rejected')}
                              disabled={actionLoading === apt._id}
                              style={{ background: '#ffebee', color: '#c62828', fontWeight: 700, fontSize: 12, padding: '9px 18px', borderRadius: 10, border: '1.5px solid #ffcdd2', cursor: 'pointer', opacity: actionLoading === apt._id ? 0.6 : 1, transition: 'all 0.2s' }}
                              onMouseEnter={e => { if (actionLoading !== apt._id) e.currentTarget.style.background = '#ffcdd2' }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#ffebee' }}
                            >
                              ✕ Reject
                            </button>
                          </div>
                        )}

                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatus(apt._id, 'completed')}
                            disabled={actionLoading === apt._id}
                            style={{ background: '#e3f2fd', color: '#1565c0', fontWeight: 700, fontSize: 12, padding: '9px 18px', borderRadius: 10, border: '1.5px solid #bbdefb', cursor: 'pointer', opacity: actionLoading === apt._id ? 0.6 : 1, transition: 'all 0.2s' }}
                            onMouseEnter={e => { if (actionLoading !== apt._id) e.currentTarget.style.background = '#bbdefb' }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#e3f2fd' }}
                          >
                            {actionLoading === apt._id ? 'Updating...' : '🏁 Mark Completed'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Reason */}
                    {apt.reason && (
                      <div style={{ marginTop: 16, padding: '12px 16px', background: '#f8faff', borderRadius: 10, borderLeft: '3px solid #1565c0' }}>
                        <p style={{ color: '#546e7a', fontSize: 13, margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
                          "{apt.reason}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

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
            {['Privacy Policy', 'Terms of Service', 'Contact'].map((link) => (
              <span
                key={link}
                style={{ color: '#78909c', fontSize: 12, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#90caf9'}
                onMouseLeave={e => e.target.style.color = '#78909c'}
              >{link}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  )
}

export default DoctorAppointmentsPage