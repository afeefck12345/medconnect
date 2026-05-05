import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'

const PATIENT_LINKS = [
  { label: 'Dashboard',    path: '/home',          icon: '🏠' },
  { label: 'Doctors',      path: '/doctors',       icon: '👨‍⚕️' },
  { label: 'Appointments', path: '/appointments',  icon: '📅' },
  { label: 'Profile',      path: '/profile',       icon: '👤' },
  { label: 'Prescriptions',path: '/prescriptions', icon: '💊' },
  { label: 'My Reviews',   path: '/my-reviews',    icon: '⭐' },
]

const DOCTOR_LINKS = [
  { label: 'Dashboard',    path: '/doctor/dashboard',      icon: '📊' },
  { label: 'Appointments', path: '/doctor/appointments',   icon: '📅' },
  { label: 'Schedule',     path: '/doctor/schedule',       icon: '🗓' },
  { label: 'Video Setup',  path: '/doctor/video-settings', icon: '🎥' },
  { label: 'Prescriptions',path: '/doctor/prescriptions',  icon: '💊' },
  { label: 'Notifications',path: '/notifications',         icon: '🔔' },
  { label: 'Profile',      path: '/doctor/profile',        icon: '👤' },
]

const ADMIN_LINKS = [
  { label: 'Dashboard',    path: '/admin/dashboard',    icon: '📊' },
  { label: 'Users',        path: '/admin/users',        icon: '👥' },
  { label: 'Doctors',      path: '/admin/doctors',      icon: '🩺' },
  { label: 'Appointments', path: '/admin/appointments', icon: '📅' },
  { label: 'Notifications',path: '/notifications',      icon: '🔔' },
]

export default function DashboardLayout({ role, children }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const { user } = useSelector((state) => state.auth)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const sidebarW = sidebarCollapsed ? '72px' : '236px'
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1)
  const prefixName = role === 'doctor' ? 'Dr. ' : ''
  
  let navLinks = PATIENT_LINKS
  if (role === 'doctor') navLinks = DOCTOR_LINKS
  if (role === 'admin') navLinks = ADMIN_LINKS

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: sidebarW, minHeight: '100vh', background: '#1a1f3c',
        display: 'flex', flexDirection: 'column', padding: '24px 12px',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 200,
        transition: 'width 0.25s ease', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', marginBottom: '32px' }}>
          {!sidebarCollapsed && (
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
              Medi<span style={{ color: '#4cc9f0' }}>Connect</span>
            </span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '6px 9px',
              fontSize: '0.95rem', lineHeight: 1,
              marginLeft: sidebarCollapsed ? 'auto' : 0, marginRight: sidebarCollapsed ? 'auto' : 0,
            }}
          >
            {sidebarCollapsed ? '›' : '‹'}
          </button>
        </div>

        {!sidebarCollapsed && (
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', padding: '0 10px', marginBottom: '8px' }}>
            {displayRole} Menu
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navLinks.map(({ label, path, icon }) => {
            const isActive = location.pathname === path || (path !== '/home' && path !== '/doctor/dashboard' && path !== '/admin/dashboard' && location.pathname.startsWith(path))
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                title={sidebarCollapsed ? label : ''}
                style={{
                  display: 'flex', alignItems: 'center', gap: sidebarCollapsed ? 0 : '12px',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '11px' : '11px 14px', borderRadius: '10px',
                  background: isActive ? '#4361ee' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                  border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: isActive ? 700 : 500,
                  fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.18s', whiteSpace: 'nowrap', width: '100%',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff' } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' } }}
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
                {(user?.name || displayRole).charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prefixName}{user?.name || displayRole}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.38)' }}>{displayRole}</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #4361ee, #4cc9f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>
                {(user?.name || displayRole).charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? 'Logout' : ''}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: sidebarCollapsed ? 0 : '10px', padding: sidebarCollapsed ? '10px' : '10px 14px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '10px', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
          >
            <span style={{ fontSize: '1rem' }}>🚪</span>
            {!sidebarCollapsed && 'Logout'}
          </button>
        </div>
      </aside>

      <main style={{ marginLeft: sidebarW, flex: 1, padding: '36px 40px', transition: 'margin-left 0.25s ease', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
