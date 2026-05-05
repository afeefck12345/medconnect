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

  useEffect(() => {
    return () => dispatch(clearError())
  }, [dispatch])

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

      {/* Centered Body */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -40, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '15%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(144,202,249,0.07)', pointerEvents: 'none' }} />

        {/* Small tagline above the form */}
        <div style={{ textAlign: 'center', marginBottom: 20, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 10 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4fc3f7', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#90caf9', fontSize: 12, fontWeight: 600 }}>Trusted by 50,000+ patients</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>
            Your health journey continues here
          </p>
        </div>

        {/* Floating Form Card */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 360,
          background: '#fff',
          borderRadius: 20,
          padding: '28px 26px',
          boxShadow: '0 12px 56px rgba(8,30,80,0.28)',
          border: '1px solid rgba(255,255,255,0.5)',
        }}>

          {/* Form Header */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, boxShadow: '0 4px 14px rgba(21,101,192,0.28)' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#fff"/>
              </svg>
            </div>
            <p style={{ color: '#1565c0', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 3px' }}>Welcome Back</p>
            <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 19, margin: '0 0 5px', letterSpacing: '-0.5px' }}>Sign in to MedConnect</h2>
            <p style={{ color: '#90a4ae', fontSize: 12, margin: 0 }}>Enter your credentials to access your account</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 12, fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1a2744', marginBottom: 5 }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                placeholder="you@example.com"
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
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                placeholder="••••••••"
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
                fontWeight: 700,
                fontSize: 14,
                padding: '11px',
                borderRadius: 10,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: 4,
                boxShadow: loading ? 'none' : '0 4px 14px rgba(21,101,192,0.28)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.92' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e8edf5' }} />
            <span style={{ color: '#b0bec5', fontSize: 11, fontWeight: 500 }}>New to MedConnect?</span>
            <div style={{ flex: 1, height: 1, background: '#e8edf5' }} />
          </div>

          <Link
            to="/register"
            style={{
              display: 'block',
              textAlign: 'center',
              background: 'transparent',
              color: '#1565c0',
              fontWeight: 700,
              fontSize: 13,
              padding: '10px',
              borderRadius: 10,
              border: '1.5px solid #1565c0',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1565c0'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1565c0' }}
          >
            Create a Free Account
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  )
}

export default LoginPage