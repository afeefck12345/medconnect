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
    const submitData = { ...formData }
    delete submitData.confirmPassword
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
      background: '#f0f4ff',
    }}>

      {/* Navbar */}
      <nav style={{
        flexShrink: 0,
        background: 'linear-gradient(90deg, #1565c0 0%, #0d47a1 100%)',
        boxShadow: '0 2px 12px rgba(21,101,192,0.18)',
        zIndex: 10,
      }}>
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

      {/* Split Body */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
      }}>

        {/* LEFT PANEL — Branding */}
        <div style={{
          width: '42%',
          flexShrink: 0,
          background: 'linear-gradient(160deg, #1565c0 0%, #1976d2 55%, #0d47a1 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 44px',
          position: 'relative',
          overflow: 'hidden',
        }}>

          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -100, right: -60, width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '38%', right: '-40px', width: 200, height: 200, borderRadius: '50%', background: 'rgba(144,202,249,0.09)', pointerEvents: 'none' }} />

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.35)', borderRadius: 20, padding: '5px 14px', marginBottom: 28, width: 'fit-content' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4fc3f7', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#90caf9', fontSize: 12, fontWeight: 600 }}>Trusted by 50,000+ patients</span>
          </div>

          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 30, lineHeight: 1.25, margin: '0 0 16px', letterSpacing: '-0.5px' }}>
            Your Health,<br />
            <span style={{ color: '#90caf9' }}>Simplified.</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, lineHeight: 1.7, margin: '0 0 36px', maxWidth: 300 }}>
            Connect with top doctors, book appointments instantly, and manage your healthcare journey — all in one place.
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '🏥', title: 'Find Specialists', desc: 'Browse verified doctors across all specialties' },
              { icon: '📅', title: 'Easy Booking', desc: 'Schedule appointments in under 60 seconds' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your health data is always protected' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {icon}
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 1 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { value: '50K+', label: 'Patients' },
              { value: '1,200+', label: 'Doctors' },
              { value: '4.9★', label: 'App Rating' },
            ].map(({ value, label }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.09)', borderRadius: 12, padding: '14px 10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{value}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {['🔒 HIPAA Compliant', '✅ ISO 27001', '🏥 Govt. Approved'].map(badge => (
              <div key={badge} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '4px 11px', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500 }}>
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL — Form */}
        <div className="hide-scrollbar" style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 32px',
          overflowY: 'auto',
          background: '#f0f4ff',
        }}>
          <div style={{ width: '100%', maxWidth: 420 }}>

            {/* Form Header */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ color: '#1565c0', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.4, margin: '0 0 4px' }}>Get Started Free</p>
              <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 22, margin: '0 0 5px', letterSpacing: '-0.5px' }}>Create Your Account</h2>
              <p style={{ color: '#90a4ae', fontSize: 13, margin: 0 }}>Fill in the details below to join MedConnect</p>
            </div>

            {/* Card */}
            <div style={{
              background: '#fff',
              borderRadius: 18,
              padding: '26px 28px',
              boxShadow: '0 8px 40px rgba(21,101,192,0.10)',
              border: '1px solid #e8edf5',
            }}>

              {/* Error */}
              {error && (
                <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 12, fontWeight: 500 }}>
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>

                {/* Row: Name + Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a2744', marginBottom: 5 }}>Full Name</label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe"
                      style={inputStyle('name')}
                      onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a2744', marginBottom: 5 }}>Email Address</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com"
                      style={inputStyle('email')}
                      onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                    />
                  </div>
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

                {/* Row: Password + Confirm */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a2744', marginBottom: 5 }}>Password</label>
                    <input
                      type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Min. 6 characters"
                      style={inputStyle('password')}
                      onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                    />
                  </div>
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
                    padding: '12px', borderRadius: 10, border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s', marginTop: 2,
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(21,101,192,0.28)',
                    letterSpacing: 0.3,
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.92' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  {loading ? 'Creating Account…' : 'Create Account →'}
                </button>
              </form>
            </div>

            {/* Sign in link */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 12px' }}>
              <div style={{ flex: 1, height: 1, background: '#dde4f0' }} />
              <span style={{ color: '#b0bec5', fontSize: 11, fontWeight: 500 }}>Already a member?</span>
              <div style={{ flex: 1, height: 1, background: '#dde4f0' }} />
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
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }

        @media (max-width: 768px) {
          .split-left { display: none !important; }
        }
      `}</style>
    </div>
  )
}

export default RegisterPage