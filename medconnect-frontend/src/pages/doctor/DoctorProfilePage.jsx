import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserProfile, logout } from '../../features/auth/authSlice'
import API from '../../api/axios'

const SPECIALIZATIONS = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
  'Orthopedic', 'Pediatrician', 'Gynecologist', 'Ophthalmologist',
  'ENT Specialist', 'Psychiatrist', 'Dentist', 'Radiologist',
]

const navLinks = [
  { label: 'Dashboard',    path: '/doctor/dashboard' },
  { label: 'Appointments', path: '/doctor/appointments' },
  { label: 'Schedule',     path: '/doctor/schedule' },
  { label: 'Prescriptions',path: '/doctor/prescriptions' },
  { label: 'Profile',      path: '/doctor/profile' },
]

const inputStyle = {
  width: '100%',
  padding: '11px 16px',
  border: '1.5px solid #e8edf5',
  borderRadius: 10,
  fontSize: 13,
  color: '#1a2744',
  background: '#f8faff',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
}

const DoctorProfilePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [form, setForm] = useState({
    name: '', email: '', specialization: '',
    experience: '', fee: '', phone: '', bio: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState(null)

  useEffect(() => { dispatch(getUserProfile()) }, [dispatch])

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (user) {
        try {
          const { data } = await API.get('/doctors/profile')
          setForm({
            name: user.name || '', email: user.email || '', phone: user.phone || '',
            specialization: data.specialization || '',
            experience: data.experience || '',
            fee: data.consultationFee || '',
            bio: data.bio || '',
          })
        } catch {
          setForm(p => ({ ...p, name: user.name, email: user.email, phone: user.phone }))
        }
      }
    }
    fetchDoctorDetails()
  }, [user])

  const handleLogout = () => { dispatch(logout()); navigate('/login') }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true); setError(null)
    try {
      await API.post('/doctors/profile', { ...form, consultationFee: Number(form.fee), experience: Number(form.experience) })
      dispatch(getUserProfile())
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
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
              <button key={link.path} onClick={() => navigate(link.path)}
                style={{ background: 'transparent', border: 'none', color: '#cfe2ff', fontWeight: 500, fontSize: 14, padding: '8px 16px', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#cfe2ff' }}
              >{link.label}</button>
            ))}
            <button onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.1)', color: '#ffcdd2', fontWeight: 600, fontSize: 13, padding: '9px 16px', borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', marginLeft: 8, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.background = 'rgba(244,67,54,0.25)'; e.target.style.color = '#fff' }}
              onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.color = '#ffcdd2' }}
            >Logout</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)', padding: '56px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: 20, left: '60%', width: 150, height: 150, borderRadius: '50%', background: 'rgba(144,202,249,0.1)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 28 }}>
          {/* Avatar */}
          <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 32, flexShrink: 0, backdropFilter: 'blur(10px)' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'D'}
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#90caf9', fontSize: 12, fontWeight: 600 }}>Doctor Portal</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: 34, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              Dr. {user?.name || 'Doctor'}
            </h1>
            <p style={{ color: '#bbdefb', fontSize: 14, margin: 0 }}>
              {form.specialization || 'Setup your specialization below'} &nbsp;·&nbsp; My Profile
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 860, margin: '-40px auto 0', padding: '0 24px 64px', position: 'relative', zIndex: 10 }}>

        {/* Alerts */}
        {error && (
          <div style={{ background: '#ffebee', border: '1.5px solid #ffcdd2', color: '#c62828', borderRadius: 12, padding: '12px 18px', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}
        {saved && (
          <div style={{ background: '#e8f5e9', border: '1.5px solid #a5d6a7', color: '#2e7d32', borderRadius: 12, padding: '12px 18px', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            ✓ Profile saved successfully!
          </div>
        )}

        {/* Profile Card */}
        <div style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(21,101,192,0.10)' }}>

          {/* Card Header */}
          <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 22, boxShadow: '0 4px 14px rgba(21,101,192,0.25)' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'D'}
            </div>
            <div>
              <p style={{ color: '#1a2744', fontWeight: 800, fontSize: 17, margin: 0 }}>Dr. {user?.name}</p>
              <p style={{ color: '#1565c0', fontSize: 13, fontWeight: 600, margin: '3px 0 0' }}>
                {form.specialization || 'Specialization not set'}
              </p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
              {form.experience && (
                <div style={{ background: '#fff', borderRadius: 10, padding: '8px 16px', textAlign: 'center', border: '1.5px solid #bbdefb' }}>
                  <p style={{ color: '#1565c0', fontWeight: 800, fontSize: 16, margin: 0 }}>{form.experience}+</p>
                  <p style={{ color: '#78909c', fontSize: 11, margin: '2px 0 0' }}>Yrs Exp</p>
                </div>
              )}
              {form.fee && (
                <div style={{ background: '#fff', borderRadius: 10, padding: '8px 16px', textAlign: 'center', border: '1.5px solid #bbdefb' }}>
                  <p style={{ color: '#1565c0', fontWeight: 800, fontSize: 16, margin: 0 }}>₹{form.fee}</p>
                  <p style={{ color: '#78909c', fontSize: 11, margin: '2px 0 0' }}>Fee</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Body */}
          <div style={{ padding: '32px' }}>
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: '#1565c0', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, margin: 0, marginBottom: 4 }}>Account Details</p>
              <h3 style={{ color: '#1a2744', fontWeight: 800, fontSize: 18, margin: 0 }}>Edit Profile Information</h3>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>

                {/* Full Name */}
                <div>
                  <label style={{ color: '#1a2744', fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 8 }}>Full Name</label>
                  <input type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#1565c0'}
                    onBlur={e => e.target.style.borderColor = '#e8edf5'}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ color: '#1a2744', fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 8 }}>Email <span style={{ color: '#90a4ae', fontWeight: 500 }}>(read only)</span></label>
                  <input type="email" value={form.email} disabled
                    style={{ ...inputStyle, background: '#f0f4fa', color: '#90a4ae', cursor: 'not-allowed', border: '1.5px solid #e8edf5' }}
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label style={{ color: '#1a2744', fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 8 }}>Specialization</label>
                  <select value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    style={{ ...inputStyle, appearance: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#1565c0'}
                    onBlur={e => e.target.style.borderColor = '#e8edf5'}
                  >
                    <option value="">Select specialization</option>
                    {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label style={{ color: '#1a2744', fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 8 }}>Years of Experience</label>
                  <input type="number" value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    placeholder="e.g. 8"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#1565c0'}
                    onBlur={e => e.target.style.borderColor = '#e8edf5'}
                  />
                </div>

                {/* Fee */}
                <div>
                  <label style={{ color: '#1a2744', fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 8 }}>Consultation Fee (₹)</label>
                  <input type="number" value={form.fee}
                    onChange={(e) => setForm({ ...form, fee: e.target.value })}
                    placeholder="e.g. 500"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#1565c0'}
                    onBlur={e => e.target.style.borderColor = '#e8edf5'}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ color: '#1a2744', fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 8 }}>Phone Number</label>
                  <input type="text" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#1565c0'}
                    onBlur={e => e.target.style.borderColor = '#e8edf5'}
                  />
                </div>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ color: '#1a2744', fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 8 }}>About / Bio</label>
                <textarea value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={4}
                  placeholder="Describe your expertise, approach, and experience..."
                  style={{ ...inputStyle, resize: 'none', lineHeight: 1.7 }}
                  onFocus={e => e.target.style.borderColor = '#1565c0'}
                  onBlur={e => e.target.style.borderColor = '#e8edf5'}
                />
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" onClick={() => navigate('/doctor/dashboard')}
                  style={{ background: 'transparent', border: '1.5px solid #e8edf5', color: '#546e7a', fontWeight: 600, fontSize: 14, padding: '12px 24px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.color = '#1565c0' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.color = '#546e7a' }}
                >Cancel</button>
                <button type="submit" disabled={saving}
                  style={{ background: saving ? '#90a4ae' : 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 10, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s', boxShadow: saving ? 'none' : '0 4px 14px rgba(21,101,192,0.25)' }}
                  onMouseEnter={e => { if (!saving) e.currentTarget.style.opacity = '0.9' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
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

export default DoctorProfilePage