import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllUsers, deleteUser } from '../../features/admin/adminSlice'
import { logout } from '../../features/auth/authSlice'

const roleStyles = {
  patient: { background: '#e3f2fd', color: '#1565c0', border: '1px solid #90caf9' },
  doctor:  { background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7' },
  admin:   { background: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a' },
}

const navLinks = [
  { label: 'Dashboard',    path: '/admin/dashboard' },
  { label: 'Users',        path: '/admin/users' },
  { label: 'Doctors',      path: '/admin/doctors' },
  { label: 'Appointments', path: '/admin/appointments' },
]

const AdminUsersPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { users, loading } = useSelector((state) => state.admin)
  const [search, setSearch]           = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting]       = useState(null)

  useEffect(() => { dispatch(getAllUsers()) }, [dispatch])

  const handleLogout = () => { dispatch(logout()); navigate('/login') }

  const handleDelete = async (id) => {
    setDeleting(id)
    await dispatch(deleteUser(id))
    setConfirmDelete(null)
    setDeleting(null)
  }

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  )

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
      <div style={{ background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)', padding: '40px 0 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '35%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7' }} />
              <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 600 }}>Admin Panel</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>All Users</h1>
            <p style={{ color: '#bbdefb', fontSize: 15, margin: 0 }}>View, search and manage every registered user on the platform</p>
          </div>
          {/* Search */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="15" height="15" fill="none" stroke="#90a4ae" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12, border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 10, fontSize: 14, outline: 'none', color: '#1a2744', background: 'rgba(255,255,255,0.95)', width: 280, transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#fff'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.25)'}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '-32px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 10 }}>

        {/* Count bar */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '16px 24px', boxShadow: '0 8px 40px rgba(21,101,192,0.10)', border: '1px solid #e3f2fd', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#90a4ae', fontSize: 13 }}>
            <span style={{ color: '#1a2744', fontWeight: 700 }}>{filtered.length}</span> user{filtered.length !== 1 ? 's' : ''} found
          </span>
          <div style={{ display: 'flex', gap: 16 }}>
            {['patient', 'doctor', 'admin'].map(role => {
              const count = users.filter(u => u.role === role).length
              return (
                <span key={role} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span style={{ fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'capitalize', ...(roleStyles[role]) }}>{role}</span>
                  <span style={{ color: '#90a4ae', fontWeight: 600 }}>{count}</span>
                </span>
              )
            })}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', gap: 12, background: '#fff', borderRadius: 18, border: '1.5px solid #e8edf5' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #e3f2fd', borderTop: '3px solid #1565c0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#90a4ae', fontSize: 14 }}>Loading users...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 18, border: '1.5px solid #e8edf5' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
            <p style={{ color: '#90a4ae', fontSize: 15, margin: 0 }}>No users found</p>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(21,101,192,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #e8edf5', background: '#f8faff' }}>
                  {['User', 'Email', 'Role', 'Joined', 'Actions'].map((h, i) => (
                    <th key={h} style={{ textAlign: i === 4 ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: '#90a4ae', padding: '14px 20px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, idx) => (
                  <tr
                    key={u._id}
                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f0f4fa' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8faff'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* User */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1565c0', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                          {u.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a2744' }}>{u.name}</span>
                      </div>
                    </td>
                    {/* Email */}
                    <td style={{ padding: '16px 20px', fontSize: 13, color: '#546e7a' }}>{u.email}</td>
                    {/* Role */}
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, textTransform: 'capitalize', ...(roleStyles[u.role] || { background: '#f0f4fa', color: '#546e7a', border: '1px solid #e8edf5' }) }}>
                        {u.role}
                      </span>
                    </td>
                    {/* Joined */}
                    <td style={{ padding: '16px 20px', fontSize: 13, color: '#90a4ae' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => setConfirmDelete(u._id)}
                          style={{ background: '#ffebee', color: '#c62828', fontWeight: 700, fontSize: 12, padding: '7px 16px', borderRadius: 8, border: '1px solid #ef9a9a', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#ffcdd2' }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#ffebee' }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,39,68,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '0 16px' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px 28px', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(21,101,192,0.2)', border: '1.5px solid #e3f2fd' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 18 }}>🗑️</div>
            <h3 style={{ color: '#1a2744', fontWeight: 800, fontSize: 18, margin: '0 0 8px' }}>Delete User?</h3>
            <p style={{ color: '#90a4ae', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>
              This action cannot be undone. The user and all their data will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{ flex: 1, background: '#fff', border: '1.5px solid #e8edf5', color: '#546e7a', fontWeight: 600, fontSize: 14, padding: '12px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8faff'; e.currentTarget.style.borderColor = '#90caf9' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e8edf5' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting === confirmDelete}
                style={{ flex: 1, background: deleting === confirmDelete ? '#e0e0e0' : 'linear-gradient(135deg, #c62828, #e53935)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px', borderRadius: 10, border: 'none', cursor: deleting === confirmDelete ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s' }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                {deleting === confirmDelete ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default AdminUsersPage