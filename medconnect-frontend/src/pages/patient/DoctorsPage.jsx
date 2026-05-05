import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { getAllDoctors } from '../../features/doctor/doctorSlice'

const specializations = ['All', 'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic', 'Pediatrician']

const specIcons = {
  'All': '🏥',
  'General Physician': '🩺',
  'Cardiologist': '❤️',
  'Dermatologist': '🧴',
  'Neurologist': '🧠',
  'Orthopedic': '🦴',
  'Pediatrician': '👶',
}

const DoctorsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { doctors, loading } = useSelector((state) => state.doctor)
  const [search, setSearch] = useState('')
  const [selectedSpec, setSelectedSpec] = useState(
    location.state?.suggestedSpecialty || 'All'
  )

  useEffect(() => {
    dispatch(getAllDoctors())
  }, [dispatch])

  useEffect(() => {
    if (location.state?.suggestedSpecialty) {
      setSelectedSpec(location.state.suggestedSpecialty)
    }
  }, [location.state])

  const filtered = (Array.isArray(doctors) ? doctors : []).filter((doc) => {
    const doctorName = doc.user?.name || ''
    const matchSearch = doctorName.toLowerCase().includes(search.toLowerCase())
    const matchSpec = selectedSpec === 'All' || doc.specialization === selectedSpec
    return matchSearch && matchSpec
  })

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/home')}>
            <div style={{ width: 38, height: 38, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#1565c0"/>
              </svg>
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>Med<span style={{ color: '#90caf9' }}>Connect</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {['Home', 'Appointments', 'Profile'].map(item => (
              <button
                key={item}
                onClick={() => navigate(`/${item.toLowerCase()}`)}
                style={{ background: 'transparent', border: 'none', color: '#cfe2ff', fontWeight: 500, fontSize: 14, padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#cfe2ff' }}
              >{item}</button>
            ))}
            <button
              onClick={() => navigate('/doctors')}
              style={{ background: '#fff', color: '#1565c0', fontWeight: 700, fontSize: 13, padding: '9px 20px', borderRadius: 8, cursor: 'pointer', border: 'none', marginLeft: 8 }}
            >
              Get Appointment
            </button>
          </div>
        </div>
      </nav>

      {/* Page Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)', padding: '48px 0 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '40%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <p style={{ color: '#90caf9', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 10px' }}>Our Medical Team</p>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 38, margin: '0 0 12px', letterSpacing: '-0.5px' }}>Find Your Doctor</h1>
          <p style={{ color: '#bbdefb', fontSize: 15, margin: 0 }}>Browse and book appointments with our top-rated specialists</p>
        </div>
      </div>

      {/* AI Banner */}
      {location.state?.suggestedSpecialty && selectedSpec !== 'All' && (
        <div style={{ maxWidth: 1200, margin: '-20px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          <div style={{ background: '#e8f5e9', border: '1.5px solid #a5d6a7', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <p style={{ margin: 0, color: '#2e7d32', fontSize: 14, fontWeight: 500 }}>
                AI Recommendation — Showing specialists for: <strong>{selectedSpec}</strong>
              </p>
            </div>
            <button
              onClick={() => setSelectedSpec('All')}
              style={{ background: 'transparent', border: '1px solid #66bb6a', color: '#2e7d32', fontWeight: 600, fontSize: 12, padding: '6px 14px', borderRadius: 8, cursor: 'pointer' }}
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {/* Search Bar */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', marginBottom: 20, boxShadow: '0 2px 12px rgba(21,101,192,0.07)', border: '1.5px solid #e8edf5', display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="18" height="18" fill="none" stroke="#90a4ae" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor name..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#1a2744', background: 'transparent' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#90a4ae', fontSize: 18, lineHeight: 1 }}>×</button>
          )}
        </div>

        {/* Specialization Filter Pills */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpec(spec)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 30, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', border: '1.5px solid',
                background: selectedSpec === spec ? '#1565c0' : '#fff',
                color: selectedSpec === spec ? '#fff' : '#455a64',
                borderColor: selectedSpec === spec ? '#1565c0' : '#e0e7ef',
                boxShadow: selectedSpec === spec ? '0 4px 12px rgba(21,101,192,0.25)' : 'none',
              }}
            >
              <span>{specIcons[spec]}</span> {spec}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {!loading && (
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: '#546e7a', fontSize: 14, margin: 0 }}>
              Showing <strong style={{ color: '#1565c0' }}>{filtered.length}</strong> doctor{filtered.length !== 1 ? 's' : ''}
              {selectedSpec !== 'All' ? ` in ${selectedSpec}` : ''}
            </p>
          </div>
        )}

        {/* Doctors Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0', gap: 14, flexDirection: 'column' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e3f2fd', borderTop: '3px solid #1565c0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#90a4ae', fontSize: 14 }}>Finding available doctors...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ color: '#1a2744', fontWeight: 700, fontSize: 18, margin: '0 0 8px' }}>No doctors found</h3>
            <p style={{ color: '#90a4ae', fontSize: 14, margin: '0 0 20px' }}>Try adjusting your search or filter</p>
            <button onClick={() => { setSearch(''); setSelectedSpec('All') }} style={{ background: '#1565c0', color: '#fff', fontWeight: 600, fontSize: 14, padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {filtered.map((doctor) => (
              <div
                key={doctor._id}
                onClick={() => navigate(`/doctors/${doctor._id}`)}
                style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 18, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s', boxShadow: '0 2px 12px rgba(21,101,192,0.05)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(21,101,192,0.14)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(21,101,192,0.05)' }}
              >
                {/* Card Header */}
                <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', padding: '24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 24, flexShrink: 0, boxShadow: '0 4px 14px rgba(21,101,192,0.3)' }}>
                    {(doctor.user?.name || 'D').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ color: '#1a2744', fontWeight: 800, fontSize: 15, margin: '0 0 4px' }}>Dr. {doctor.user?.name || 'Doctor'}</p>
                    <span style={{ background: '#1565c0', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                      {doctor.specialization || 'General Physician'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '18px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff8e1', borderRadius: 8, padding: '6px 12px' }}>
                      <span>⭐</span>
                      <span style={{ fontWeight: 800, color: '#f59e0b', fontSize: 13 }}>{doctor.rating || '4.5'}</span>
                      <span style={{ color: '#bdbdbd', fontSize: 12 }}>({doctor.totalReviews || 0})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#78909c', fontSize: 13 }}>
                      <span>🏅</span>
                      <span style={{ fontWeight: 600 }}>{doctor.experience || 0} yrs exp</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/doctors/${doctor._id}`) }}
                    style={{ width: '100%', background: 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
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
              <span key={link} style={{ color: '#78909c', fontSize: 12, cursor: 'pointer' }}
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

export default DoctorsPage