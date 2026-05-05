import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/authSlice'
import { getMyAppointments } from '../../features/appointment/appointmentSlice'

const statusConfig = {
  pending:   { bg: '#fff8e1', color: '#f59e0b', label: 'Pending' },
  confirmed: { bg: '#e8f5e9', color: '#2e7d32', label: 'Confirmed' },
  rejected:  { bg: '#ffebee', color: '#c62828', label: 'Rejected' },
  completed: { bg: '#e3f2fd', color: '#1565c0', label: 'Completed' },
}

const navLinks = [
  { label: 'Dashboard',     path: '/doctor/dashboard' },
  { label: 'Appointments',  path: '/doctor/appointments' },
  { label: 'Schedule',      path: '/doctor/schedule' },
  { label: 'Prescriptions', path: '/doctor/prescriptions' },
  { label: 'Profile',       path: '/doctor/profile' },
]

const DoctorDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { appointments, loading } = useSelector((state) => state.appointment)

  useEffect(() => {
    dispatch(getMyAppointments())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const today = new Date().toISOString().split('T')[0]
  const todayAppts     = appointments.filter((a) => new Date(a.date).toISOString().split('T')[0] === today)
  const pendingAppts   = appointments.filter((a) => a.status === 'pending')
  const completedAppts = appointments.filter((a) => a.status === 'completed')

  const stats = [
    { label: "Today's Appointments", value: todayAppts.length,     icon: '📅', bg: '#e3f2fd', color: '#1565c0' },
    { label: 'Pending Requests',     value: pendingAppts.length,   icon: '⏳', bg: '#fff8e1', color: '#f59e0b' },
    { label: 'Total Appointments',   value: appointments.length,   icon: '🗂️', bg: '#e8f5e9', color: '#2e7d32' },
    { label: 'Completed',            value: completedAppts.length, icon: '✅', bg: '#f3e5f5', color: '#7b1fa2' },
  ]

  const quickActions = [
    { label: 'Appointments', icon: '📋', path: '/doctor/appointments' },
    { label: 'Schedule',     icon: '🗓️', path: '/doctor/schedule' },
    { label: 'Prescriptions',icon: '💊', path: '/doctor/prescriptions' },
    { label: 'My Profile',   icon: '👤', path: '/doctor/profile' },
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

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)',
        padding: '60px 0 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: 20, left: '60%', width: 150, height: 150, borderRadius: '50%', background: 'rgba(144,202,249,0.1)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            {/* Left */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7', animation: 'pulse 2s infinite' }} />
                <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 600 }}>Doctor Portal</span>
              </div>
              <h1 style={{ color: '#fff', fontSize: 42, fontWeight: 800, lineHeight: 1.15, marginBottom: 12, letterSpacing: '-1px' }}>
                Welcome back,<br />
                <span style={{ color: '#90caf9' }}>Dr. {user?.name || 'Doctor'}</span> 👋
              </h1>
              <p style={{ color: '#bbdefb', fontSize: 15, lineHeight: 1.7, marginBottom: 32, maxWidth: 420 }}>
                {user?.specialization || 'Professional Specialist'} &nbsp;·&nbsp; {user?.experience || 0} years experience
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => navigate('/doctor/appointments')}
                  style={{ background: '#fff', color: '#1565c0', fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  View Appointments →
                </button>
                <button
                  onClick={() => navigate('/doctor/schedule')}
                  style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 600, fontSize: 15, padding: '14px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                >
                  Manage Schedule
                </button>
              </div>
            </div>

            {/* Right: stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ color: '#90caf9', fontSize: 12, marginTop: 6, fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 64px' }}>

        {/* Recent Appointments */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <p style={{ color: '#1565c0', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.2, margin: 0, marginBottom: 6 }}>Overview</p>
              <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 26, margin: 0 }}>Recent Appointments</h2>
            </div>
            <button
              onClick={() => navigate('/doctor/appointments')}
              style={{ background: 'transparent', border: '1.5px solid #1565c0', color: '#1565c0', fontWeight: 600, fontSize: 13, padding: '8px 20px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1565c0'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1565c0' }}
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', gap: 12 }}>
              <div style={{ width: 36, height: 36, border: '3px solid #e3f2fd', borderTop: '3px solid #1565c0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ color: '#90a4ae', fontSize: 14 }}>Loading appointments...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <p style={{ color: '#90a4ae', fontSize: 15 }}>No appointments yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {appointments.slice(0, 5).map((apt) => {
                const sc = statusConfig[apt.status] || { bg: '#f5f5f5', color: '#757575', label: apt.status }
                return (
                  <div
                    key={apt._id}
                    style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 16, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, transition: 'all 0.25s', boxShadow: '0 2px 8px rgba(21,101,192,0.04)', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(21,101,192,0.12)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(21,101,192,0.04)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
                        {apt.patient?.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <p style={{ color: '#1a2744', fontWeight: 700, fontSize: 15, margin: 0 }}>{apt.patient?.name || 'Patient'}</p>
                        <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
                          <span style={{ color: '#90a4ae', fontSize: 12 }}>📅 {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span style={{ color: '#90a4ae', fontSize: 12 }}>🕐 {apt.timeSlot}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      {apt.reason && (
                        <p style={{ color: '#90a4ae', fontSize: 12, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{apt.reason}</p>
                      )}
                      <span style={{ background: sc.bg, color: sc.color, fontWeight: 700, fontSize: 11, padding: '4px 12px', borderRadius: 20, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                        {sc.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <div style={{ marginBottom: 28 }}>
            <p style={{ color: '#1565c0', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.2, margin: 0, marginBottom: 6 }}>Navigate</p>
            <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 26, margin: 0 }}>Quick Actions</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 16, padding: '28px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s', boxShadow: '0 2px 8px rgba(21,101,192,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(21,101,192,0.14)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(21,101,192,0.04)' }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{action.icon}</div>
                <p style={{ fontSize: 13, color: '#1a2744', fontWeight: 700, margin: 0 }}>{action.label}</p>
              </button>
            ))}
          </div>
        </div>
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
              <span key={link} style={{ color: '#78909c', fontSize: 12, cursor: 'pointer', transition: 'color 0.2s' }}
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

export default DoctorDashboard