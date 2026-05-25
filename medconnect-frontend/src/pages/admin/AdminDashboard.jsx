import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAnalytics, getAllAppointments } from '../../features/admin/adminSlice'
import { logout } from '../../features/auth/authSlice'

const statusStyles = {
  pending:   { background: '#fff8e1', color: '#f59e0b', border: '1px solid #fde68a' },
  confirmed: { background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7' },
  rejected:  { background: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a' },
  cancelled: { background: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db' },
  completed: { background: '#e3f2fd', color: '#1565c0', border: '1px solid #90caf9' },
}

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { analytics, appointments, loading } = useSelector((state) => state.admin)

  // Responsive States
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    dispatch(getAnalytics())
    dispatch(getAllAppointments())

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const stats = [
    { label: 'Total Users',        value: analytics?.totalUsers        || 0, icon: '👥', accent: '#1565c0', bg: '#e3f2fd' },
    { label: 'Total Doctors',      value: analytics?.totalDoctors      || 0, icon: '🩺', accent: '#2e7d32', bg: '#e8f5e9' },
    { label: 'Total Appointments', value: analytics?.totalAppointments || 0, icon: '📅', accent: '#6a1b9a', bg: '#f3e5f5' },
    { label: 'Pending Approvals',  value: analytics?.pendingDoctors    || 0, icon: '⏳', accent: '#f59e0b', bg: '#fff8e1' },
  ]

  const navLinks = [
    { label: 'Dashboard',    path: '/admin/dashboard' },
    { label: 'Users',        path: '/admin/users' },
    { label: 'Doctors',      path: '/admin/doctors' },
    { label: 'Appointments', path: '/admin/appointments' },
  ]

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: '#f0f4fa', minHeight: '100vh' }}>

      {/* Top Info Bar */}
      <div className="mobile-hide" style={{ background: '#fff', borderBottom: '1px solid #e8edf5', padding: '8px 0' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/admin/dashboard')}>
            <div style={{ width: 38, height: 38, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#1565c0"/>
              </svg>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>
                Med<span style={{ color: '#90caf9' }}>Connect</span>
              </span>
              <span className="mobile-hide" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffcdd2', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)' }}>
                ADMIN
              </span>
            </div>
          </div>

          {isMobile ? (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.6rem', cursor: 'pointer', padding: '8px' }}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          ) : (
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
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobile && mobileMenuOpen && (
          <div style={{ background: '#1565c0', padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
                style={{ background: 'transparent', border: 'none', color: '#cfe2ff', fontWeight: 500, fontSize: 15, padding: '10px 0', cursor: 'pointer', textAlign: 'left', width: '100%' }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.1)', color: '#ffcdd2', fontWeight: 600, fontSize: 14, padding: '10px', borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', width: '100%', textAlign: 'center', marginTop: 4 }}
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)',
        padding: isMobile ? '40px 0 60px' : '60px 0 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: 20, left: '60%', width: 150, height: 150, borderRadius: '50%', background: 'rgba(144,202,249,0.1)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start', textAlign: isMobile ? 'center' : 'left' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7' }} />
              <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 600 }}>Admin Panel</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: isMobile ? 32 : 42, fontWeight: 800, lineHeight: 1.15, marginBottom: 12, letterSpacing: '-1px' }}>
              MedConnect Dashboard 🛡️
            </h1>
            <p style={{ color: '#bbdefb', fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
              Manage users, doctors, and appointments from one central place.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: isMobile ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/admin/doctors')}
                style={{ background: '#fff', color: '#1565c0', fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Review Doctors →
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 600, fontSize: 15, padding: '14px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              >
                Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: isMobile ? '20px auto 0' : '-36px auto 0', padding: isMobile ? '0 16px 60px' : '0 24px 60px', position: 'relative', zIndex: 10 }}>

        {/* Stats Cards */}
        <div className="responsive-grid-4" style={{ marginBottom: 28 }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 18, padding: '24px 20px', boxShadow: '0 2px 12px rgba(21,101,192,0.05)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(21,101,192,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(21,101,192,0.05)' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>
                {stat.icon}
              </div>
              <p style={{ color: '#1a2744', fontWeight: 800, fontSize: 28, margin: '0 0 4px' }}>{stat.value}</p>
              <p style={{ color: '#90a4ae', fontSize: 12, margin: 0, fontWeight: 600 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: '#1565c0', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 6px' }}>Admin Controls</p>
            <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: isMobile ? 20 : 22, margin: 0 }}>Quick Actions</h2>
          </div>
          <div className="responsive-grid-3" style={{ gap: 16 }}>
            {[
              { label: 'Manage Users',      icon: '👥', path: '/admin/users',        desc: 'View & delete platform users' },
              { label: 'Approve Doctors',   icon: '🩺', path: '/admin/doctors',      desc: 'Review doctor registrations' },
              { label: 'All Appointments',  icon: '📋', path: '/admin/appointments', desc: 'Monitor all bookings' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 18, padding: '24px 20px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.25s', boxShadow: '0 2px 8px rgba(21,101,192,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(21,101,192,0.14)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(21,101,192,0.04)' }}
              >
                <div style={{ fontSize: 30, marginBottom: 14 }}>{action.icon}</div>
                <p style={{ color: '#1a2744', fontWeight: 700, fontSize: 15, margin: '0 0 6px' }}>{action.label}</p>
                <p style={{ color: '#90a4ae', fontSize: 12, margin: 0 }}>{action.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Appointments */}
        <div style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 18, padding: isMobile ? '20px 16px' : '28px 28px', boxShadow: '0 2px 12px rgba(21,101,192,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
            <div>
              <p style={{ color: '#1565c0', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 6px' }}>Overview</p>
              <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: isMobile ? 18 : 20, margin: 0 }}>Recent Appointments</h2>
            </div>
            <button
              onClick={() => navigate('/admin/appointments')}
              style={{ background: 'transparent', border: '1.5px solid #1565c0', color: '#1565c0', fontWeight: 600, fontSize: 13, padding: '8px 20px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s', width: isMobile ? '100%' : 'auto', textAlign: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1565c0'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1565c0' }}
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0', gap: 12 }}>
              <div style={{ width: 32, height: 32, border: '3px solid #e3f2fd', borderTop: '3px solid #1565c0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ color: '#90a4ae', fontSize: 14 }}>Loading...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
              <p style={{ color: '#90a4ae', fontSize: 14, margin: 0 }}>No appointments yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {appointments.slice(0, 6).map((apt) => (
                <div
                  key={apt._id}
                  style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', gap: 12, padding: '14px 18px', background: '#f8faff', borderRadius: 12, border: '1px solid #e3f2fd', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#90caf9'; e.currentTarget.style.background = '#f0f7ff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e3f2fd'; e.currentTarget.style.background = '#f8faff' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1565c0', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                      {apt.patient?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1a2744', margin: 0 }}>{apt.patient?.name || 'Patient'}</p>
                      <p style={{ fontSize: 12, color: '#90a4ae', margin: '3px 0 0', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        <span>Dr. {apt.doctor?.name || 'Doctor'}</span>
                        <span className="mobile-hide">·</span>
                        <span>{new Date(apt.date).toLocaleDateString()}</span>
                        <span>·</span>
                        <span>{apt.timeSlot}</span>
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: isMobile ? 'flex-end' : 'flex-end', borderTop: isMobile ? '1px solid #e3f2fd' : 'none', paddingTop: isMobile ? 8 : 0 }}>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '5px 14px',
                      borderRadius: 20,
                      textTransform: 'capitalize',
                      ...(statusStyles[apt.status] || { background: '#f0f4fa', color: '#546e7a', border: '1px solid #e8edf5' })
                    }}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Strip */}
      <div style={{ background: '#1a2744', padding: '24px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 0, alignItems: 'center', justifyContent: 'space-between', textAlign: isMobile ? 'center' : 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#1565c0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 16 }}>❤️</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>MedConnect</span>
          </div>
          <p style={{ color: '#546e7a', fontSize: 13, margin: 0 }}>© 2025 MedConnect. Caring for your health, every step of the way.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Contact'].map(link => (
              <span key={link} style={{ color: '#78909c', fontSize: 12, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#90caf9'}
                onMouseLeave={e => e.target.style.color = '#78909c'}
              >{link}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default AdminDashboard
