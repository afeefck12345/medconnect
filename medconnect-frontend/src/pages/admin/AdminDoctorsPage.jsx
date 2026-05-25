import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllDoctors, approveDoctor, rejectDoctor } from '../../features/admin/adminSlice'
import { logout } from '../../features/auth/authSlice'

const statusStyles = {
  approved: { background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7' },
  pending:  { background: '#fff8e1', color: '#f59e0b', border: '1px solid #fde68a' },
  rejected: { background: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a' },
}

const AdminDoctorsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { doctors, loading } = useSelector((state) => state.admin)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    dispatch(getAllDoctors())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleApprove = async (id) => {
    setActionLoading(id + '_approve')
    await dispatch(approveDoctor(id))
    setActionLoading(null)
  }

  const handleReject = async (id) => {
    setActionLoading(id + '_reject')
    await dispatch(rejectDoctor(id))
    setActionLoading(null)
  }

  const filtered = doctors
    .filter((d) => filter === 'all' || d.status === filter)
    .filter(
      (d) =>
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(search.toLowerCase())
    )

  const pendingCount = doctors.filter((d) => d.status === 'pending').length

  const navLinks = [
    { label: 'Dashboard',    path: '/admin/dashboard' },
    { label: 'Users',        path: '/admin/users' },
    { label: 'Doctors',      path: '/admin/doctors' },
    { label: 'Appointments', path: '/admin/appointments' },
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

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)',
        padding: '40px 0 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '35%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7' }} />
              <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 600 }}>Admin Panel</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>Manage Doctors</h1>
            <p style={{ color: '#bbdefb', fontSize: 15, margin: 0 }}>
              Review registrations, approve or revoke doctor access
            </p>
          </div>
          {/* Search */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="15" height="15" fill="none" stroke="#90a4ae" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12, border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 10, fontSize: 14, outline: 'none', color: '#1a2744', background: 'rgba(255,255,255,0.95)', width: 300, transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#fff'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.25)'}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '-32px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 10 }}>

        {/* Filter Tabs + count bar */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', boxShadow: '0 8px 40px rgba(21,101,192,0.10)', border: '1px solid #e3f2fd', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
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
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
                onMouseEnter={e => { if (filter !== tab) { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.color = '#1565c0' } }}
                onMouseLeave={e => { if (filter !== tab) { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.color = '#78909c' } }}
              >
                {tab}
                {tab === 'pending' && pendingCount > 0 && (
                  <span style={{ background: '#f59e0b', color: '#fff', fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 10 }}>
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          <span style={{ color: '#90a4ae', fontSize: 13, fontWeight: 500 }}>
            <span style={{ color: '#1a2744', fontWeight: 700 }}>{filtered.length}</span> doctor{filtered.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Doctor List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', gap: 12, background: '#fff', borderRadius: 18, border: '1.5px solid #e8edf5' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #e3f2fd', borderTop: '3px solid #1565c0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#90a4ae', fontSize: 14 }}>Loading doctors...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 18, border: '1.5px solid #e8edf5' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🩺</div>
            <p style={{ color: '#90a4ae', fontSize: 15, margin: 0 }}>No doctors found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map((doctor) => (
              <div
                key={doctor._id}
                style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 18, padding: '24px', boxShadow: '0 2px 12px rgba(21,101,192,0.05)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#90caf9'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(21,101,192,0.10)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(21,101,192,0.05)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>

                  {/* Left: Avatar + Info */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 22, flexShrink: 0, boxShadow: '0 4px 16px rgba(21,101,192,0.3)' }}>
                      {doctor.name?.charAt(0)?.toUpperCase() || 'D'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <p style={{ color: '#1a2744', fontWeight: 800, fontSize: 16, margin: 0 }}>Dr. {doctor.name}</p>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'capitalize',
                          ...(statusStyles[doctor.status] || { background: '#f0f4fa', color: '#546e7a', border: '1px solid #e8edf5' })
                        }}>
                          {doctor.status || 'pending'}
                        </span>
                      </div>
                      <p style={{ color: '#90a4ae', fontSize: 13, margin: '0 0 10px' }}>{doctor.email}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {doctor.specialization && (
                          <span style={{ background: '#e3f2fd', color: '#1565c0', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, border: '1px solid #90caf9' }}>
                            {doctor.specialization}
                          </span>
                        )}
                        {doctor.experience && (
                          <span style={{ color: '#78909c', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                            🏅 {doctor.experience} yrs exp
                          </span>
                        )}
                        {doctor.fee && (
                          <span style={{ color: '#78909c', fontSize: 12, fontWeight: 600 }}>
                            💊 ₹{doctor.fee}/consult
                          </span>
                        )}
                      </div>
                      {doctor.bio && (
                        <p style={{ color: '#90a4ae', fontSize: 12, margin: '10px 0 0', maxWidth: 520, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {doctor.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    {(!doctor.status || doctor.status === 'pending') && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleApprove(doctor._id)}
                          disabled={actionLoading === doctor._id + '_approve'}
                          style={{ background: 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '9px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', opacity: actionLoading === doctor._id + '_approve' ? 0.6 : 1, transition: 'opacity 0.2s' }}
                          onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.opacity = '0.88' }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = actionLoading === doctor._id + '_approve' ? '0.6' : '1' }}
                        >
                          {actionLoading === doctor._id + '_approve' ? '...' : '✓ Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(doctor._id)}
                          disabled={actionLoading === doctor._id + '_reject'}
                          style={{ background: '#ffebee', color: '#c62828', fontWeight: 700, fontSize: 13, padding: '9px 20px', borderRadius: 10, border: '1px solid #ef9a9a', cursor: 'pointer', opacity: actionLoading === doctor._id + '_reject' ? 0.6 : 1, transition: 'all 0.2s' }}
                          onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = '#ffcdd2' } }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#ffebee' }}
                        >
                          {actionLoading === doctor._id + '_reject' ? '...' : '✕ Reject'}
                        </button>
                      </div>
                    )}
                    {doctor.status === 'approved' && (
                      <button
                        onClick={() => handleReject(doctor._id)}
                        disabled={actionLoading === doctor._id + '_reject'}
                        style={{ background: '#ffebee', color: '#c62828', fontWeight: 700, fontSize: 13, padding: '9px 20px', borderRadius: 10, border: '1px solid #ef9a9a', cursor: 'pointer', opacity: actionLoading === doctor._id + '_reject' ? 0.6 : 1, transition: 'all 0.2s' }}
                        onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#ffcdd2' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#ffebee' }}
                      >
                        {actionLoading === doctor._id + '_reject' ? '...' : 'Revoke'}
                      </button>
                    )}
                    {doctor.status === 'rejected' && (
                      <button
                        onClick={() => handleApprove(doctor._id)}
                        disabled={actionLoading === doctor._id + '_approve'}
                        style={{ background: 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '9px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', opacity: actionLoading === doctor._id + '_approve' ? 0.6 : 1, transition: 'opacity 0.2s' }}
                        onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.opacity = '0.88' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = actionLoading === doctor._id + '_approve' ? '0.6' : '1' }}
                      >
                        {actionLoading === doctor._id + '_approve' ? '...' : 'Re-approve'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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

export default AdminDoctorsPage