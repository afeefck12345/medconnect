import DashboardLayout from '../../components/DashboardLayout'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllDoctors } from '../../features/doctor/doctorSlice'
import { logout } from '../../features/auth/authSlice'

const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { doctors, loading } = useSelector((state) => state.doctor)
  const [symptoms, setSymptoms] = useState('')

  useEffect(() => {
    dispatch(getAllDoctors())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleAnalyze = () => {
    const input = symptoms.toLowerCase()
    let specialty = 'General Physician'
    if (input.includes('heart') || input.includes('chest')) specialty = 'Cardiologist'
    else if (input.includes('skin') || input.includes('rash')) specialty = 'Dermatologist'
    else if (input.includes('brain') || input.includes('headache')) specialty = 'Neurologist'
    else if (input.includes('bone') || input.includes('joint')) specialty = 'Orthopedic'
    else if (input.includes('kid') || input.includes('child')) specialty = 'Pediatrician'
    navigate('/doctors', { state: { suggestedSpecialty: specialty } })
  }

  const specializations = [
    { label: 'General Physician', icon: '🩺' },
    { label: 'Cardiologist', icon: '❤️' },
    { label: 'Dermatologist', icon: '🧴' },
    { label: 'Neurologist', icon: '🧠' },
    { label: 'Orthopedic', icon: '🦴' },
    { label: 'Pediatrician', icon: '👶' },
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
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: 38, height: 38, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#1565c0"/>
              </svg>
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>Med<span style={{ color: '#90caf9' }}>Connect</span></span>
          </div>

          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {['Doctors', 'Appointments', 'Profile'].map(item => (
              <button
                key={item}
                onClick={() => navigate(`/${item.toLowerCase()}`)}
                style={{ background: 'transparent', border: 'none', color: '#cfe2ff', fontWeight: 500, fontSize: 14, padding: '8px 16px', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#cfe2ff' }}
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

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)',
        padding: '80px 0 100px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: 20, left: '60%', width: 150, height: 150, borderRadius: '50%', background: 'rgba(144,202,249,0.1)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            {/* Left Content */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7', animation: 'pulse 2s infinite' }} />
                <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 600 }}>Medical & Health Services</span>
              </div>
              <h1 style={{ color: '#fff', fontSize: 46, fontWeight: 800, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-1px' }}>
                Welcome back,<br />
                <span style={{ color: '#90caf9' }}>{user?.name || 'Patient'}</span> 👋
              </h1>
              <p style={{ color: '#bbdefb', fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 420 }}>
                A professional and friendly care provider — let's find the right specialist for your health needs today.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => navigate('/doctors')}
                  style={{ background: '#fff', color: '#1565c0', fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  All Doctors →
                </button>
                <button
                  onClick={() => navigate('/appointments')}
                  style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 600, fontSize: 15, padding: '14px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                >
                  My Appointments
                </button>
              </div>
            </div>

            {/* Right: Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { value: '500+', label: 'Expert Doctors', icon: '👨‍⚕️' },
                { value: '98%', label: 'Patient Satisfaction', icon: '⭐' },
                { value: '24/7', label: 'Emergency Support', icon: '🚑' },
                { value: '50k+', label: 'Patients Served', icon: '🏥' },
              ].map((stat, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 24, lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ color: '#90caf9', fontSize: 12, marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Symptom Checker - Floating over hero */}
      <div style={{ maxWidth: 1200, margin: '-40px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', boxShadow: '0 8px 40px rgba(21,101,192,0.12)', border: '1px solid #e3f2fd' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 200 }}>
              <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🤖</div>
              <div>
                <h3 style={{ color: '#1a2744', fontWeight: 700, fontSize: 16, margin: 0 }}>AI Symptom Checker</h3>
                <p style={{ color: '#90a4ae', fontSize: 12, margin: 0, marginTop: 2 }}>Describe your symptoms for instant guidance</p>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', gap: 12 }}>
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && symptoms.trim() && handleAnalyze()}
                placeholder="e.g. persistent headache and blurred vision..."
                style={{ flex: 1, padding: '12px 18px', border: '1.5px solid #e3f2fd', borderRadius: 10, fontSize: 14, outline: 'none', color: '#1a2744', background: '#f8faff', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#1565c0'}
                onBlur={e => e.target.style.borderColor = '#e3f2fd'}
              />
              <button
                onClick={handleAnalyze}
                disabled={!symptoms.trim()}
                style={{
                  background: symptoms.trim() ? 'linear-gradient(135deg, #1565c0, #1976d2)' : '#e0e0e0',
                  color: symptoms.trim() ? '#fff' : '#9e9e9e',
                  fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 10, border: 'none', cursor: symptoms.trim() ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap', transition: 'all 0.2s'
                }}
              >
                Analyze Symptoms
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>

        {/* Browse by Specialization */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <p style={{ color: '#1565c0', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.2, margin: 0, marginBottom: 6 }}>Our Departments</p>
              <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 26, margin: 0 }}>Browse by Specialization</h2>
            </div>
            <button
              onClick={() => navigate('/doctors')}
              style={{ background: 'transparent', border: '1.5px solid #1565c0', color: '#1565c0', fontWeight: 600, fontSize: 13, padding: '8px 20px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1565c0'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1565c0' }}
            >
              View All →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
            {specializations.map((spec) => (
              <button
                key={spec.label}
                onClick={() => navigate('/doctors', { state: { suggestedSpecialty: spec.label } })}
                style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 16, padding: '24px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s', boxShadow: '0 2px 8px rgba(21,101,192,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(21,101,192,0.14)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(21,101,192,0.04)' }}
              >
                <div style={{ fontSize: 34, marginBottom: 12 }}>{spec.icon}</div>
                <p style={{ fontSize: 11, color: '#455a64', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{spec.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Why Choose Us - Feature Strip */}
        <div style={{ background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)', borderRadius: 20, padding: '40px', marginBottom: 56, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { icon: '🏆', title: 'Expert Doctors', desc: 'Board-certified specialists across all fields' },
            { icon: '⚡', title: 'Fast Booking', desc: 'Book appointments in under 60 seconds' },
            { icon: '🔒', title: 'Private & Secure', desc: 'Your health data is fully protected' },
            { icon: '💊', title: 'Holistic Care', desc: 'Comprehensive treatment & follow-up' },
          ].map((f, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: '0 0 6px' }}>{f.title}</h4>
              <p style={{ color: '#90caf9', fontSize: 12, margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Top Rated Specialists */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <p style={{ color: '#1565c0', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.2, margin: 0, marginBottom: 6 }}>Our Team</p>
              <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 26, margin: 0 }}>Top Rated Specialists</h2>
            </div>
            <button
              onClick={() => navigate('/doctors')}
              style={{ background: 'transparent', border: '1.5px solid #1565c0', color: '#1565c0', fontWeight: 600, fontSize: 13, padding: '8px 20px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1565c0'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1565c0' }}
            >
              View All Doctors →
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', gap: 12 }}>
              <div style={{ width: 36, height: 36, border: '3px solid #e3f2fd', borderTop: '3px solid #1565c0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ color: '#90a4ae', fontSize: 14 }}>Loading doctors...</span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {doctors.slice(0, 3).map((doctor) => (
                <div
                  key={doctor._id}
                  onClick={() => navigate(`/doctors/${doctor._id}`)}
                  style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 18, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s', boxShadow: '0 2px 12px rgba(21,101,192,0.05)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(21,101,192,0.14)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(21,101,192,0.05)' }}
                >
                  {/* Card Header */}
                  <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', padding: '28px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 26, flexShrink: 0, boxShadow: '0 4px 16px rgba(21,101,192,0.3)' }}>
                      {(doctor.user?.name || doctor.name || 'D').charAt(0)}
                    </div>
                    <div>
                      <p style={{ color: '#1a2744', fontWeight: 800, fontSize: 16, margin: 0 }}>Dr. {doctor.user?.name || doctor.name}</p>
                      <p style={{ color: '#1565c0', fontSize: 13, fontWeight: 600, margin: '4px 0 0' }}>{doctor.specialization}</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff8e1', borderRadius: 8, padding: '6px 12px' }}>
                        <span style={{ fontSize: 14 }}>⭐</span>
                        <span style={{ fontWeight: 800, color: '#f59e0b', fontSize: 14 }}>{doctor.rating || '4.9'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#78909c', fontSize: 13 }}>
                        <span>🏅</span>
                        <span style={{ fontWeight: 600 }}>{doctor.experience || 5}+ yrs exp</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/doctors/${doctor._id}`) }}
                      style={{ width: '100%', background: 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Strip */}
      <div style={{ background: '#1a2744', marginTop: 48, padding: '24px 0' }}>
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
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  )
}

export default HomePage