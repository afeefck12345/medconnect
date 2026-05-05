import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'

const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])
  return null
}

export default function PatientShell({ title, subtitle, rightAction, children }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const navLinks = [
    { label: 'Dashboard', path: '/home', icon: '🏠' },
    { label: 'Doctors', path: '/doctors', icon: '👨‍⚕️' },
    { label: 'Appointments', path: '/appointments', icon: '📅' },
    { label: 'Prescriptions', path: '/prescriptions', icon: '💊' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ]

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const sidebarW = sidebarCollapsed ? '72px' : '236px'

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f0f4ff',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#0d1b3e',
      }}
    >
      <FontLoader />
      <aside
        style={{
          width: sidebarW,
          minHeight: '100vh',
          background: '#1a1f3c',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 12px',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 200,
          transition: 'width 0.25s ease',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', marginBottom: '32px' }}>
          {!sidebarCollapsed && (
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
              Medi<span style={{ color: '#4cc9f0' }}>Care</span>
            </span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              padding: '6px 9px',
              fontSize: '0.95rem',
              lineHeight: 1,
              marginLeft: sidebarCollapsed ? 'auto' : 0,
              marginRight: sidebarCollapsed ? 'auto' : 0,
            }}
          >
            {sidebarCollapsed ? '›' : '‹'}
          </button>
        </div>

        {!sidebarCollapsed && (
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', padding: '0 10px', marginBottom: '8px' }}>
            Menu
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navLinks.map(({ label, path, icon }) => {
            const isActive = location.pathname === path
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                title={sidebarCollapsed ? label : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: sidebarCollapsed ? 0 : '12px',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '11px' : '11px 14px',
                  borderRadius: '10px',
                  background: isActive ? '#4361ee' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'all 0.18s',
                  whiteSpace: 'nowrap',
                  width: '100%',
                }}
              >
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
                {!sidebarCollapsed && label}
              </button>
            )
          })}
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
          {!sidebarCollapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', marginBottom: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #4361ee, #4cc9f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#fff', flexShrink: 0 }}>
                {(user?.name || 'P').charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Patient'}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.38)' }}>Patient</div>
              </div>
            </div>
          ) : null}
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? 'Logout' : ''}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: sidebarCollapsed ? 0 : '10px',
              padding: sidebarCollapsed ? '10px' : '10px 14px',
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '10px',
              color: 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <span style={{ fontSize: '1rem' }}>🚪</span>
            {!sidebarCollapsed && 'Logout'}
          </button>
        </div>
      </aside>

      <main style={{ marginLeft: sidebarW, flex: 1, padding: '36px 40px', transition: 'margin-left 0.25s ease', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{title}</h1>
            {subtitle ? <p style={{ fontSize: '0.875rem', color: '#7a8db3', marginTop: '6px' }}>{subtitle}</p> : null}
          </div>
          {rightAction ? <div>{rightAction}</div> : null}
        </div>
        {children}
      </main>
    </div>
  )
}

