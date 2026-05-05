import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getDoctorById } from '../../features/doctor/doctorSlice'

const DoctorDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedDoctor: doctor, loading } = useSelector((state) => state.doctor)

  useEffect(() => {
    dispatch(getDoctorById(id))
  }, [dispatch, id])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0f4fa', gap: 14 }}>
      <div style={{ width: 44, height: 44, border: '3px solid #e3f2fd', borderTop: '3px solid #1565c0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ color: '#90a4ae', fontSize: 14 }}>Loading doctor profile...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!doctor) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0f4fa', gap: 12 }}>
      <div style={{ fontSize: 48 }}>🔍</div>
      <h3 style={{ color: '#1a2744', fontWeight: 700, fontSize: 18, margin: 0 }}>Doctor not found</h3>
      <button onClick={() => navigate('/doctors')} style={{ background: '#1565c0', color: '#fff', fontWeight: 600, fontSize: 14, padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', marginTop: 8 }}>
        ← Back to Doctors
      </button>
    </div>
  )

  const doctorName = doctor.user?.name || doctor.name || 'Doctor'

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => navigate('/doctors')}
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, fontSize: 13, padding: '7px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            >
              ← Back
            </button>
            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/home')}>
              <div style={{ width: 34, height: 34, background: '#fff', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#1565c0"/>
                </svg>
              </div>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>Med<span style={{ color: '#90caf9' }}>Connect</span></span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {['Home', 'Doctors', 'Appointments', 'Profile'].map(item => (
              <button key={item} onClick={() => navigate(`/${item.toLowerCase()}`)}
                style={{ background: 'transparent', border: 'none', color: '#cfe2ff', fontWeight: 500, fontSize: 14, padding: '8px 14px', borderRadius: 6, cursor: 'pointer' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#cfe2ff' }}
              >{item}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)', padding: '48px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '35%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <p style={{ color: '#90caf9', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 10px' }}>Doctor Profile</p>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 34, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            Dr. {doctorName}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#e3f2fd', fontSize: 13, fontWeight: 600, padding: '4px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)' }}>
              {doctor.specialization || 'General Physician'}
            </span>
            <span style={{ color: '#90caf9', fontSize: 13 }}>•</span>
            <span style={{ color: '#bbdefb', fontSize: 13 }}>{doctor.experience || 0} years experience</span>
          </div>
        </div>
      </div>

      {/* Main Content — floats over hero */}
      <div style={{ maxWidth: 1100, margin: '-40px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 5 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>

          {/* Left — Profile Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Avatar + Stats */}
            <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(21,101,192,0.1)', border: '1.5px solid #e8edf5' }}>
              {/* Avatar Header */}
              <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 32, margin: '0 auto 16px', boxShadow: '0 6px 20px rgba(21,101,192,0.35)' }}>
                  {doctorName.charAt(0).toUpperCase()}
                </div>
                <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 18, margin: '0 0 4px' }}>Dr. {doctorName}</h2>
                <p style={{ color: '#1565c0', fontSize: 13, fontWeight: 600, margin: 0 }}>{doctor.specialization || 'General Physician'}</p>
              </div>

              {/* Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid #e8edf5' }}>
                {[
                  { value: `⭐ ${doctor.rating || '4.5'}`, label: 'Rating' },
                  { value: doctor.totalReviews || 0, label: 'Reviews' },
                  { value: `${doctor.patients || 0}+`, label: 'Patients' },
                ].map((stat, i) => (
                  <div key={i} style={{ padding: '16px 8px', textAlign: 'center', borderRight: i < 2 ? '1px solid #e8edf5' : 'none' }}>
                    <p style={{ color: '#1a2744', fontWeight: 800, fontSize: 14, margin: '0 0 2px' }}>{stat.value}</p>
                    <p style={{ color: '#90a4ae', fontSize: 11, margin: 0 }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Fee */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e8edf5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: '#90a4ae', fontSize: 11, margin: '0 0 2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Consultation Fee</p>
                  <p style={{ color: '#1565c0', fontWeight: 800, fontSize: 22, margin: 0 }}>₹{doctor.fee || '500'}</p>
                </div>
                <div style={{ background: '#e8f5e9', borderRadius: 10, padding: '8px 12px', textAlign: 'center' }}>
                  <span style={{ fontSize: 20 }}>💊</span>
                  <p style={{ color: '#2e7d32', fontSize: 10, fontWeight: 700, margin: '2px 0 0' }}>Available</p>
                </div>
              </div>
            </div>

            {/* Quick Info Card */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '20px', boxShadow: '0 4px 16px rgba(21,101,192,0.06)', border: '1.5px solid #e8edf5' }}>
              <h4 style={{ color: '#1a2744', fontWeight: 700, fontSize: 14, margin: '0 0 14px' }}>Quick Info</h4>
              {[
                { icon: '🎓', label: 'Experience', value: `${doctor.experience || 0} years` },
                { icon: '🏥', label: 'Department', value: doctor.specialization || 'General' },
                { icon: '🕒', label: 'Timings', value: '9:00 AM – 6:00 PM' },
                { icon: '📅', label: 'Available', value: 'Mon – Fri' },
              ].map((info, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid #f5f7fa' : 'none' }}>
                  <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{info.icon}</span>
                  <div>
                    <p style={{ color: '#90a4ae', fontSize: 11, margin: 0, fontWeight: 600 }}>{info.label}</p>
                    <p style={{ color: '#1a2744', fontSize: 13, fontWeight: 600, margin: '1px 0 0' }}>{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* About */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '28px', boxShadow: '0 4px 20px rgba(21,101,192,0.07)', border: '1.5px solid #e8edf5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: '#e3f2fd', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👨‍⚕️</div>
                <h3 style={{ color: '#1a2744', fontWeight: 700, fontSize: 16, margin: 0 }}>About Dr. {doctorName}</h3>
              </div>
              <p style={{ color: '#546e7a', fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                {doctor.bio || `Dr. ${doctorName} is a highly experienced ${doctor.specialization || 'physician'} with ${doctor.experience || 0} years of practice. Committed to providing quality healthcare and personalized treatment plans for all patients. Known for a compassionate approach and evidence-based medical care.`}
              </p>
            </div>

            {/* Availability */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '28px', boxShadow: '0 4px 20px rgba(21,101,192,0.07)', border: '1.5px solid #e8edf5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, background: '#e3f2fd', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📅</div>
                <h3 style={{ color: '#1a2744', fontWeight: 700, fontSize: 16, margin: 0 }}>Weekly Availability</h3>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                  <div key={day} style={{ background: 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px 18px', borderRadius: 10, boxShadow: '0 4px 10px rgba(21,101,192,0.2)' }}>
                    {day}
                  </div>
                ))}
                {['Sat', 'Sun'].map((day) => (
                  <div key={day} style={{ background: '#f5f7fa', color: '#bdbdbd', fontWeight: 600, fontSize: 13, padding: '10px 18px', borderRadius: 10 }}>
                    {day}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8faff', borderRadius: 10, padding: '12px 16px' }}>
                <span style={{ fontSize: 16 }}>🕒</span>
                <p style={{ color: '#546e7a', fontSize: 13, fontWeight: 600, margin: 0 }}>Consultation Hours: <span style={{ color: '#1565c0' }}>9:00 AM – 6:00 PM</span></p>
              </div>
            </div>

            {/* What to Expect */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '28px', boxShadow: '0 4px 20px rgba(21,101,192,0.07)', border: '1.5px solid #e8edf5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, background: '#e3f2fd', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✅</div>
                <h3 style={{ color: '#1a2744', fontWeight: 700, fontSize: 16, margin: 0 }}>What to Expect</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { icon: '🔍', text: 'Thorough diagnosis & examination' },
                  { icon: '💬', text: 'Personalized consultation' },
                  { icon: '📋', text: 'Detailed treatment plan' },
                  { icon: '🔁', text: 'Follow-up care & support' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#f8faff', borderRadius: 12, padding: '14px' }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <p style={{ color: '#455a64', fontSize: 13, fontWeight: 500, margin: 0, lineHeight: 1.4 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Book Appointment CTA */}
            <div style={{ background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)', borderRadius: 20, padding: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
              <div style={{ position: 'absolute', bottom: -40, left: '30%', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 20, margin: '0 0 8px' }}>Ready to consult Dr. {doctorName}?</h3>
                <p style={{ color: '#90caf9', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>
                  Book your appointment now and get quality, personalized care from a trusted specialist.
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => navigate('/appointments', { state: { doctorId: doctor._id } })}
                    style={{ flex: 1, background: '#fff', color: '#1565c0', fontWeight: 800, fontSize: 15, padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Book Appointment →
                  </button>
                  <button
                    onClick={() => navigate('/doctors')}
                    style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 600, fontSize: 14, padding: '14px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                  >
                    Other Doctors
                  </button>
                </div>
              </div>
            </div>

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
            {['Privacy Policy', 'Terms of Service', 'Contact'].map(link => (
              <span key={link} style={{ color: '#78909c', fontSize: 12, cursor: 'pointer' }}
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

export default DoctorDetailPage