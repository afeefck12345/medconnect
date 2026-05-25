import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllAppointments } from '../../features/admin/adminSlice'
import { logout } from '../../features/auth/authSlice'

const statusStyles = {
  pending:   { background: '#fff8e1', color: '#f59e0b', border: '1px solid #fde68a' },
  confirmed: { background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7' },
  rejected:  { background: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a' },
  cancelled: { background: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db' },
  completed: { background: '#e3f2fd', color: '#1565c0', border: '1px solid #90caf9' },
}

const AdminAppointmentsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { appointments, loading } = useSelector((state) => state.admin)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(getAllAppointments())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const filtered = appointments
    .filter((a) => filter === 'all' || a.status === filter)
    .filter(
      (a) =>
        a.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.doctor?.name?.toLowerCase().includes(search.toLowerCase())
    )

  const counts = {
    all:       appointments.length,
    pending:   appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    rejected:  appointments.filter((a) => a.status === 'rejected').length,
  }

  const navLinks = [
    { label: 'Dashboard',    path: '/admin/dashboard' },
    { label: 'Users',        path: '/admin/users' },
    { label: 'Doctors',      path: '/admin/doctors' },
    { label: 'Appointments', path: '/admin/appointments' },
  ]

  const countCardAccent = {
    all:       '#1565c0',
    pending:   '#f59e0b',
    confirmed: '#2e7d32',
    completed: '#1565c0',
    cancelled: '#6b7280',
    rejected:  '#c62828',
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
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/admin/dashboard')}>
            <div style={{ width: 38, height: 38, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#1565c0"/>
              </svg>
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>
              Med<span style={{ color: '#90caf9' }}>Connect</span>
            </span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#ffcdd2', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)', marginLeft: 4 }}>
              ADMIN
            </span>
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

      {/* Page Hero / Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)',
        padding: '40px 0 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '40%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7' }} />
            <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 600 }}>Admin Panel</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>All Appointments</h1>
          <p style={{ color: '#bbdefb', fontSize: 15, margin: 0 }}>
            View and manage every appointment across the platform
          </p>
        </div>
      </div>

      {/* Main Content — floats over hero */}
      <div style={{ maxWidth: 1200, margin: '-32px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 10 }}>

        {/* Search + Result Count Bar */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 8px 40px rgba(21,101,192,0.10)', border: '1px solid #e3f2fd', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <span style={{ color: '#1a2744', fontWeight: 700, fontSize: 15 }}>{filtered.length} appointment{filtered.length !== 1 ? 's' : ''}</span>
            <span style={{ color: '#90a4ae', fontSize: 13, marginLeft: 8 }}>
              {filter !== 'all' ? `filtered by "${filter}"` : 'showing all'}
            </span>
          </div>
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="15" height="15" fill="none" stroke="#90a4ae" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search patient or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36, paddingRight: 16, paddingTop: 10, paddingBottom: 10, border: '1.5px solid #e3f2fd', borderRadius: 10, fontSize: 14, outline: 'none', color: '#1a2744', background: '#f8faff', width: 260, transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#1565c0'}
              onBlur={e => e.target.style.borderColor = '#e3f2fd'}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
          {Object.entries(counts).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                background: filter === key ? '#fff' : '#fff',
                border: filter === key ? `2px solid ${countCardAccent[key]}` : '1.5px solid #e8edf5',
                borderRadius: 16,
                padding: '20px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: filter === key ? `0 4px 20px rgba(21,101,192,0.12)` : '0 2px 8px rgba(21,101,192,0.04)',
              }}
              onMouseEnter={e => { if (filter !== key) { e.currentTarget.style.borderColor = countCardAccent[key]; e.currentTarget.style.transform = 'translateY(-2px)' } }}
              onMouseLeave={e => { if (filter !== key) { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.transform = 'translateY(0)' } }}
            >
              <p style={{ color: countCardAccent[key], fontWeight: 800, fontSize: 26, margin: '0 0 4px' }}>{val}</p>
              <p style={{ color: '#78909c', fontSize: 12, margin: 0, textTransform: 'capitalize', fontWeight: 600 }}>{key}</p>
            </button>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '8px 20px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: filter === tab ? 'none' : '1.5px solid #e8edf5',
                background: filter === tab ? 'linear-gradient(135deg, #1565c0, #1976d2)' : '#fff',
                color: filter === tab ? '#fff' : '#78909c',
                boxShadow: filter === tab ? '0 4px 12px rgba(21,101,192,0.25)' : 'none',
              }}
              onMouseEnter={e => { if (filter !== tab) { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.color = '#1565c0' } }}
              onMouseLeave={e => { if (filter !== tab) { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.color = '#78909c' } }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table / States */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', gap: 12, background: '#fff', borderRadius: 18, border: '1.5px solid #e8edf5' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #e3f2fd', borderTop: '3px solid #1565c0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#90a4ae', fontSize: 14 }}>Loading appointments...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 18, border: '1.5px solid #e8edf5' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <p style={{ color: '#90a4ae', fontSize: 15, margin: 0 }}>No appointments found</p>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(21,101,192,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #e8edf5', background: '#f8faff' }}>
                  {['Patient', 'Doctor', 'Date & Time', 'Reason', 'Status'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#90a4ae', padding: '14px 20px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((apt, idx) => (
                  <tr
                    key={apt._id}
                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f0f4fa' : 'none', transition: 'background 0.15s', cursor: 'default' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8faff'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Patient */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1565c0', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                          {apt.patient?.name?.charAt(0) || 'P'}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a2744' }}>{apt.patient?.name || 'Patient'}</span>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                          {apt.doctor?.name?.charAt(0) || 'D'}
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: '#1a2744', margin: 0 }}>Dr. {apt.doctor?.name || 'Doctor'}</p>
                          {apt.doctor?.specialization && (
                            <p style={{ fontSize: 11, color: '#1565c0', fontWeight: 600, margin: '2px 0 0' }}>{apt.doctor.specialization}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ fontSize: 14, color: '#1a2744', fontWeight: 600, margin: 0 }}>{new Date(apt.date).toLocaleDateString()}</p>
                      <p style={{ fontSize: 12, color: '#90a4ae', margin: '2px 0 0' }}>{apt.timeSlot}</p>
                    </td>

                    {/* Reason */}
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ fontSize: 13, color: '#546e7a', margin: 0, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apt.reason || '—'}</p>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '5px 12px',
                        borderRadius: 20,
                        textTransform: 'capitalize',
                        ...(statusStyles[apt.status] || { background: '#f0f4fa', color: '#546e7a', border: '1px solid #e8edf5' })
                      }}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

export default AdminAppointmentsPage
