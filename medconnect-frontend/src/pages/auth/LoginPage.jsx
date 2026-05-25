import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '../../features/auth/authSlice'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user, token } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [focusedField, setFocusedField] = useState(null)

  useEffect(() => {
    if (token && user) {
      if (user.role === 'admin') navigate('/admin/dashboard')
      else if (user.role === 'doctor') navigate('/doctor/dashboard')
      else navigate('/home')
    }
  }, [token, user, navigate])

  useEffect(() => { return () => dispatch(clearError()) }, [dispatch])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(formData))
  }

  const inputStyle = (field) => ({
    width: '100%',
    padding: '10px 14px',
    border: `1.5px solid ${focusedField === field ? '#1565c0' : '#e8edf5'}`,
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
            <span style={{ color: '#cfe2ff', fontSize: 13 }}>Don't have an account?</span>
            <Link
              to="/register"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: 13, padding: '7px 18px', borderRadius: 8, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Split Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

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
            Welcome<br />
            <span style={{ color: '#90caf9' }}>Back.</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, lineHeight: 1.7, margin: '0 0 36px', maxWidth: 300 }}>
            Sign in to access your health dashboard, upcoming appointments, and medical records — all in one place.
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '📋', title: 'Your Medical Records', desc: 'Access prescriptions and past visits instantly' },
              { icon: '📅', title: 'Upcoming Appointments', desc: 'View, reschedule, or cancel with ease' },
              { icon: '💬', title: 'Doctor Messages', desc: 'Secure communication with your care team' },
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
          <div style={{ width: '100%', maxWidth: 380 }}>

            {/* Form Header */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ color: '#1565c0', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.4, margin: '0 0 4px' }}>Welcome Back</p>
              <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 22, margin: '0 0 5px', letterSpacing: '-0.5px' }}>Sign In to MedConnect</h2>
              <p style={{ color: '#90a4ae', fontSize: 13, margin: 0 }}>Enter your credentials to access your account</p>
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

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a2744', marginBottom: 5 }}>Email Address</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                    required placeholder="you@example.com"
                    style={inputStyle('email')}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#1a2744' }}>Password</label>
                    <a href="#" style={{ fontSize: 11, color: '#1565c0', textDecoration: 'none', fontWeight: 600 }}
                      onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.target.style.textDecoration = 'none'}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password" name="password" value={formData.password} onChange={handleChange}
                    onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                    required placeholder="••••••••"
                    style={inputStyle('password')}
                  />
                </div>

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
                  {loading ? 'Signing in…' : 'Sign In →'}
                </button>
              </form>
            </div>

            {/* Register link */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 12px' }}>
              <div style={{ flex: 1, height: 1, background: '#dde4f0' }} />
              <span style={{ color: '#b0bec5', fontSize: 11, fontWeight: 500 }}>New to MedConnect?</span>
              <div style={{ flex: 1, height: 1, background: '#dde4f0' }} />
            </div>

            <Link
              to="/register"
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
              Create a Free Account
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}

export default LoginPage