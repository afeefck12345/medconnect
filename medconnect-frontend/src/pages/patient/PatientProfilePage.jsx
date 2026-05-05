import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserProfile, logout, updateUserProfile } from '../../features/auth/authSlice'

const PatientProfilePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useSelector((state) => state.auth)

  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    bloodGroup: '',
    address: ''
  })
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    dispatch(getUserProfile())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        dob: user.dob || '',
        bloodGroup: user.bloodGroup || '',
        address: user.address || ''
      })
    }
  }, [user])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaveSuccess(false)
    const result = await dispatch(updateUserProfile(formData))
    if (updateUserProfile.fulfilled.match(result)) {
      setEditing(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  const handleEditToggle = () => {
    setSaveSuccess(false)
    setEditing(!editing)
  }

  const profileFields = [
    { label: 'Full Name', key: 'name', type: 'text', icon: '👤' },
    { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+91 XXXXX XXXXX', icon: '📞' },
    { label: 'Date of Birth', key: 'dob', type: 'date', icon: '🎂' },
    { label: 'Blood Group', key: 'bloodGroup', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], icon: '🩸' },
    { label: 'Address', key: 'address', type: 'textarea', icon: '📍' },
  ]

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #e3f2fd',
    borderRadius: 10,
    fontSize: 14,
    outline: 'none',
    color: '#1a2744',
    background: '#f8faff',
    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
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
                style={{
                  background: item === 'Profile' ? 'rgba(255,255,255,0.15)' : 'transparent',
                  border: 'none',
                  color: item === 'Profile' ? '#fff' : '#cfe2ff',
                  fontWeight: item === 'Profile' ? 700 : 500,
                  fontSize: 14,
                  padding: '8px 16px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.background = item === 'Profile' ? 'rgba(255,255,255,0.15)' : 'transparent'; e.target.style.color = item === 'Profile' ? '#fff' : '#cfe2ff' }}
              >
                {item}
              </button>
            ))}
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
      <div style={{
        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)',
        padding: '48px 0 72px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '20%', width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7' }} />
            <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 600 }}>Patient Account</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            My Profile
          </h1>
          <p style={{ color: '#bbdefb', fontSize: 15, margin: 0 }}>
            Manage your personal information and health details
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 860, margin: '-40px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 10 }}>

        {/* Success Banner */}
        {saveSuccess && (
          <div style={{ background: '#e8f5e9', border: '1.5px solid #a5d6a7', color: '#2e7d32', fontSize: 14, padding: '12px 18px', borderRadius: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" fill="none" stroke="#2e7d32" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
            Profile updated successfully!
          </div>
        )}

        {/* Profile Header Card */}
        <div style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(21,101,192,0.10)', marginBottom: 20 }}>
          <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', padding: '32px 32px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 34, flexShrink: 0, boxShadow: '0 4px 20px rgba(21,101,192,0.35)' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 22, margin: '0 0 4px' }}>{user?.name}</h2>
                <p style={{ color: '#546e7a', fontSize: 14, margin: 0 }}>{user?.email}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(21,101,192,0.1)', borderRadius: 20, padding: '4px 12px', marginTop: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1565c0', display: 'inline-block' }} />
                  <span style={{ color: '#1565c0', fontSize: 12, fontWeight: 600 }}>Patient</span>
                </div>
              </div>
              <button
                onClick={handleEditToggle}
                style={{
                  background: editing ? 'rgba(255,255,255,0.7)' : '#fff',
                  color: editing ? '#546e7a' : '#1565c0',
                  fontWeight: 700,
                  fontSize: 13,
                  padding: '10px 22px',
                  borderRadius: 10,
                  border: editing ? '1.5px solid #cfd8dc' : '1.5px solid #1565c0',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {editing ? 'Cancel' : '✏️ Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 20, padding: '28px 32px', boxShadow: '0 4px 20px rgba(21,101,192,0.06)', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <p style={{ color: '#1565c0', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, margin: 0 }}>Patient Details</p>
          </div>
          <h3 style={{ color: '#1a2744', fontWeight: 800, fontSize: 18, margin: '0 0 24px' }}>Personal Information</h3>

          {editing && error && (
            <div style={{ background: '#ffebee', border: '1.5px solid #ffcdd2', color: '#c62828', fontSize: 14, padding: '12px 18px', borderRadius: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="16" height="16" fill="none" stroke="#c62828" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {profileFields.map((field, idx) => (
                <div
                  key={field.key}
                  style={{
                    display: 'flex',
                    alignItems: editing && field.type === 'textarea' ? 'flex-start' : 'center',
                    justifyContent: 'space-between',
                    padding: '16px 0',
                    borderBottom: idx < profileFields.length - 1 ? '1px solid #f0f4fa' : 'none',
                    gap: 20,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 180 }}>
                    <span style={{ fontSize: 18 }}>{field.icon}</span>
                    <span style={{ fontSize: 13, color: '#78909c', fontWeight: 600 }}>{field.label}</span>
                  </div>

                  {editing ? (
                    <div style={{ flex: 1 }}>
                      {field.type === 'select' ? (
                        <select
                          style={inputStyle}
                          value={formData[field.key]}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          onFocus={e => e.target.style.borderColor = '#1565c0'}
                          onBlur={e => e.target.style.borderColor = '#e3f2fd'}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
                          rows="3"
                          value={formData[field.key]}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          onFocus={e => e.target.style.borderColor = '#1565c0'}
                          onBlur={e => e.target.style.borderColor = '#e3f2fd'}
                        />
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          style={inputStyle}
                          value={formData[field.key]}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          onFocus={e => e.target.style.borderColor = '#1565c0'}
                          onBlur={e => e.target.style.borderColor = '#e3f2fd'}
                        />
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: 14, fontWeight: 600, color: user?.[field.key] ? '#1a2744' : '#b0bec5', flex: 1, textAlign: 'right' }}>
                      {field.key === 'dob' && user?.[field.key]
                        ? new Date(user[field.key]).toLocaleDateString()
                        : (user?.[field.key] || 'Not provided')}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {editing && (
              <div style={{ marginTop: 24 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: loading ? '#90caf9' : 'linear-gradient(135deg, #1565c0, #1976d2)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 15,
                    padding: '13px',
                    borderRadius: 12,
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'opacity 0.2s',
                    boxShadow: '0 4px 16px rgba(21,101,192,0.25)'
                  }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Quick Links */}
        {!editing && (
          <div style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 20, padding: '28px 32px', boxShadow: '0 4px 20px rgba(21,101,192,0.06)' }}>
            <p style={{ color: '#1565c0', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 6px' }}>Navigate</p>
            <h3 style={{ color: '#1a2744', fontWeight: 800, fontSize: 18, margin: '0 0 20px' }}>Quick Links</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: '📅 My Appointments', path: '/appointments' },
                { label: '🩺 Find Doctors', path: '/doctors' },
                { label: '🏠 Home', path: '/home' },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    textAlign: 'center',
                    padding: '16px 12px',
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#455a64',
                    background: '#f8faff',
                    border: '1.5px solid #e8edf5',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.color = '#1565c0'; e.currentTarget.style.background = '#e3f2fd'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.color = '#455a64'; e.currentTarget.style.background = '#f8faff'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {item.label}
                </button>
              ))}
            </div>
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
    </div>
  )
}

export default PatientProfilePage