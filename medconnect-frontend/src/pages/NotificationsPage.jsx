import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import API from '../api/axios'
import { logout } from '../features/auth/authSlice'

const NotificationsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadNotifications = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await API.get('/notifications/my')
      setNotifications(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load notifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadNotifications() }, [])

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`)
      setNotifications((cur) => cur.map((n) => n._id === id ? { ...n, isRead: true } : n))
    } catch {
      setError('Could not mark notification as read.')
    }
  }

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read-all')
      setNotifications((cur) => cur.map((n) => ({ ...n, isRead: true })))
    } catch {
      setError('Could not mark all notifications as read.')
    }
  }

  const handleLogout = () => { dispatch(logout()); navigate('/login') }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getNotifIcon = (title = '') => {
    const t = title.toLowerCase()
    if (t.includes('appointment')) return '📅'
    if (t.includes('prescription') || t.includes('medicine')) return '💊'
    if (t.includes('doctor')) return '👨‍⚕️'
    if (t.includes('cancel')) return '❌'
    if (t.includes('confirm') || t.includes('approved')) return '✅'
    return '🔔'
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" fill="none" stroke="#1565c0" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.09 1.18 2 2 0 012.07 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.36-.36a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            +1 800 MED-CONNECT
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav style={{ background: '#1565c0', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 12px rgba(21,101,192,0.18)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: 38, height: 38, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#1565c0"/>
              </svg>
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>Med<span style={{ color: '#90caf9' }}>Connect</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {['Doctors', 'Appointments', 'Profile'].map(item => (
              <button
                key={item}
                onClick={() => navigate(`/${item.toLowerCase()}`)}
                style={{ background: 'transparent', border: 'none', color: '#cfe2ff', fontWeight: 500, fontSize: 14, padding: '8px 16px', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#cfe2ff' }}
              >
                {item}
              </button>
            ))}
            {/* Notifications active indicator */}
            <button
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 14, padding: '8px 16px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              🔔 Notifications
              {unreadCount > 0 && (
                <span style={{ background: '#ef5350', color: '#fff', fontSize: 11, fontWeight: 800, padding: '1px 7px', borderRadius: 20, minWidth: 18, textAlign: 'center' }}>{unreadCount}</span>
              )}
            </button>
            <button
              onClick={() => navigate('/doctors')}
              style={{ background: '#fff', color: '#1565c0', fontWeight: 700, fontSize: 13, padding: '9px 20px', borderRadius: 8, cursor: 'pointer', border: 'none', marginLeft: 8, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.background = '#e3f2fd' }}
              onMouseLeave={e => { e.target.style.background = '#fff' }}
            >
              Get Appointment
            </button>
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

      {/* Page Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)', padding: '48px 0 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '25%', width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 600 }}>Activity Center</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
              Notifications 🔔
            </h1>
            <p style={{ color: '#bbdefb', fontSize: 15, margin: 0 }}>
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : "You're all caught up!"}
            </p>
          </div>
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            >
              ✓ Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 900, margin: '-40px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 10 }}>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total Notifications', value: loading ? '…' : notifications.length, icon: '🔔', color: '#1565c0', bg: '#e3f2fd' },
            { label: 'Unread', value: loading ? '…' : unreadCount, icon: '🔴', color: '#e53935', bg: '#ffebee' },
            { label: 'Read', value: loading ? '…' : notifications.filter((n) => n.isRead).length, icon: '✅', color: '#2e7d32', bg: '#e8f5e9' },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 18, padding: '22px 24px', boxShadow: '0 4px 16px rgba(21,101,192,0.06)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12, color: '#78909c', fontWeight: 600, marginTop: 4 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#ffebee', border: '1.5px solid #ffcdd2', color: '#c62828', fontSize: 14, padding: '12px 18px', borderRadius: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" fill="none" stroke="#c62828" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {error}
          </div>
        )}

        {/* Section Header */}
        {!loading && notifications.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: '#1565c0', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 6px' }}>Recent Activity</p>
            <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 20, margin: 0 }}>All Notifications</h2>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0', gap: 12 }}>
            <div style={{ width: 36, height: 36, border: '3px solid #e3f2fd', borderTop: '3px solid #1565c0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#90a4ae', fontSize: 14 }}>Loading notifications...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 20, padding: '64px 32px', textAlign: 'center', boxShadow: '0 8px 40px rgba(21,101,192,0.08)' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔔</div>
            <p style={{ color: '#90a4ae', fontSize: 15, margin: 0 }}>No notifications yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.map((item) => (
              <div
                key={item._id}
                style={{
                  background: item.isRead ? '#fff' : 'linear-gradient(135deg, #f0f7ff, #e8f4ff)',
                  border: item.isRead ? '1.5px solid #e8edf5' : '1.5px solid #90caf9',
                  borderRadius: 18,
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                  boxShadow: item.isRead ? '0 2px 8px rgba(21,101,192,0.04)' : '0 4px 20px rgba(21,101,192,0.10)',
                  transition: 'all 0.2s',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: item.isRead ? '#f0f4fa' : 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>
                  {getNotifIcon(item.title)}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#1a2744' }}>{item.title}</span>
                        {!item.isRead && (
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1565c0', display: 'inline-block', flexShrink: 0 }} />
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: '#546e7a', margin: '0 0 8px', lineHeight: 1.6 }}>{item.message}</p>
                      <span style={{ fontSize: 11, color: '#90a4ae', fontWeight: 600 }}>
                        🕐 {new Date(item.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {!item.isRead && (
                      <button
                        onClick={() => markAsRead(item._id)}
                        style={{ fontSize: 12, fontWeight: 700, color: '#1565c0', background: '#e3f2fd', border: '1.5px solid #90caf9', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0 }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#1565c0'; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#e3f2fd'; e.currentTarget.style.color = '#1565c0' }}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  )
}

export default NotificationsPage