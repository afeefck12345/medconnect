import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearError } from '../../features/auth/authSlice'

const RegisterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, token } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'patient' })
  const [passwordError, setPasswordError] = useState('')
  const [focusedField, setFocusedField] = useState(null)

  useEffect(() => { if (token) navigate('/home') }, [token, navigate])
  useEffect(() => { return () => dispatch(clearError()) }, [dispatch])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') setPasswordError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) { setPasswordError('Passwords do not match'); return }
    const { confirmPassword, ...submitData } = formData
    dispatch(registerUser(submitData))
  }

  const inputStyle = (field, hasError = false) => ({
    width: '100%',
    padding: '10px 14px',
    border: `1.5px solid ${hasError ? '#ef5350' : focusedField === field ? '#1565c0' : '#e8edf5'}`,
    borderRadius: 10,
    fontSize: 13,
    color: '#1a2744',
    background: '#f8faff',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  })

  return (
    <div style={{
      fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)',
    }}>

      {/* Navbar */}
      <nav style={{ flexShrink: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: 36, height: 36, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#1565c0"/>
              </svg>
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>Med<span style={{ color: '#90caf9' }}>Connect</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#cfe2ff', fontSize: 13 }}>Already have an account?</span>
            <Link
              to="/login"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: 13, padding: '7px 18px', borderRadius: 8, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Centered Body */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -40, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '15%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(144,202,249,0.07)', pointerEvents: 'none' }} />

        {/* Small tagline above form */}
        <div style={{ textAlign: 'center', marginBottom: 16, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4fc3f7', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#90caf9', fontSize: 12, fontWeight: 600 }}>Join 50,000+ patients on MedConnect</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>
            Create your free account in seconds
          </p>
        </div>

        {/* Floating Form Card */}
        <div className="hide-scrollbar" style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 400,
          background: '#fff',
          borderRadius: 20,
          padding: '24px 26px',
          boxShadow: '0 12px 56px rgba(8,30,80,0.28)',
          border: '1px solid rgba(255,255,255,0.5)',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 160px)',
        }}>

          {/* Form Header */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, boxShadow: '0 4px 14px rgba(21,101,192,0.28)' }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#fff"/>
              </svg>
            </div>
            <p style={{ color: '#1565c0', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 2px' }}>Get Started</p>
            <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 18, margin: '0 0 3px', letterSpacing: '-0.5px' }}>Create Your Account</h2>
            <p style={{ color: '#90a4ae', fontSize: 12, margin: 0 }}>Fill in the details below to join MedConnect</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 12, fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>

            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a2744', marginBottom: 5 }}>Full Name</label>
              <input
                type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe"
                style={inputStyle('name')}
                onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a2744', marginBottom: 5 }}>Email Address</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com"
                style={inputStyle('email')}
                onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Role Selection */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a2744', marginBottom: 8 }}>Register As</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { role: 'patient', label: '🧑 Patient', desc: 'Book appointments' },
                  { role: 'doctor', label: '👨‍⚕️ Doctor', desc: 'Manage patients' },
                ].map(({ role, label, desc }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: `1.5px solid ${formData.role === role ? '#1565c0' : '#e8edf5'}`,
                      background: formData.role === role ? 'linear-gradient(135deg, #1565c0, #1976d2)' : '#f8faff',
                      color: formData.role === role ? '#fff' : '#546e7a',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                      boxShadow: formData.role === role ? '0 4px 14px rgba(21,101,192,0.25)' : 'none',
                    }}
                    onMouseEnter={e => { if (formData.role !== role) { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.color = '#1565c0' } }}
                    onMouseLeave={e => { if (formData.role !== role) { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.color = '#546e7a' } }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 2 }}>{label.split(' ')[0]}</div>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{label.split(' ').slice(1).join(' ')}</div>
                    <div style={{ fontSize: 10, marginTop: 1, opacity: 0.8 }}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a2744', marginBottom: 5 }}>Password</label>
              <input
                type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Min. 6 characters"
                style={inputStyle('password')}
                onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a2744', marginBottom: 5 }}>Confirm Password</label>
              <input
                type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Re-enter password"
                style={inputStyle('confirmPassword', !!passwordError)}
                onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField(null)}
              />
              {passwordError && (
                <p style={{ color: '#c62828', fontSize: 11, marginTop: 4, fontWeight: 500 }}>⚠️ {passwordError}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#e0e0e0' : 'linear-gradient(135deg, #1565c0, #1976d2)',
                color: loading ? '#9e9e9e' : '#fff',
                fontWeight: 700, fontSize: 14,
                padding: '11px', borderRadius: 10, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', marginTop: 2,
                boxShadow: loading ? 'none' : '0 4px 14px rgba(21,101,192,0.28)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.92' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              {loading ? 'Creating Account…' : 'Create Account →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e8edf5' }} />
            <span style={{ color: '#b0bec5', fontSize: 11, fontWeight: 500 }}>Already a member?</span>
            <div style={{ flex: 1, height: 1, background: '#e8edf5' }} />
          </div>

          <Link
            to="/login"
            style={{
              display: 'block', textAlign: 'center',
              background: 'transparent', color: '#1565c0',
              fontWeight: 700, fontSize: 13,
              padding: '10px', borderRadius: 10,
              border: '1.5px solid #1565c0', textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1565c0'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1565c0' }}
          >
            Sign In Instead
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        /* Hide scrollbar across all browsers */
        .hide-scrollbar {
          scrollbar-width: none;         /* Firefox */
          -ms-overflow-style: none;      /* IE / Edge */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;                 /* Chrome, Safari, Opera */
        }
      `}</style>
    </div>
  )
}

export default RegisterPage