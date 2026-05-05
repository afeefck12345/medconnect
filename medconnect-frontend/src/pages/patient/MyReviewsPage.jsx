import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import API from '../../api/axios'
import { logout } from '../../features/auth/authSlice'

const MyReviewsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [reviews, setReviews]       = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const loadReviews = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await API.get('/reviews/my')
      setReviews(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your reviews.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadReviews() }, [])

  const deleteReview = async (id) => {
    setDeletingId(id)
    try {
      await API.delete(`/reviews/${id}`)
      setReviews((cur) => cur.filter((r) => r._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete review.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleLogout = () => { dispatch(logout()); navigate('/login') }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  const renderStars = (rating) =>
    [1, 2, 3, 4, 5].map((s) => (
      <span key={s} style={{ color: s <= rating ? '#f59e0b' : '#dde3ef', fontSize: 18 }}>★</span>
    ))

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
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" fill="none" stroke="#1565c0" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.09 1.18 2 2 0 012.07 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.36-.36a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            +1 800 MED-CONNECT
          </span>
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
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>Med<span style={{ color: '#90caf9' }}>Connect</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {['Home', 'Doctors', 'Appointments', 'Profile'].map(item => (
              <button key={item} onClick={() => navigate(`/${item.toLowerCase()}`)}
                style={{ background: 'transparent', border: 'none', color: '#cfe2ff', fontWeight: 500, fontSize: 14, padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#cfe2ff' }}
              >{item}</button>
            ))}
            <button
              onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.1)', color: '#ffcdd2', fontWeight: 600, fontSize: 13, padding: '9px 16px', borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', marginLeft: 4 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,67,54,0.25)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#ffcdd2' }}
            >Logout</button>
          </div>
        </div>
      </nav>

      {/* Page Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)', padding: '48px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '40%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: '#90caf9', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 10px' }}>Your Feedback</p>
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 36, margin: '0 0 10px', letterSpacing: '-0.5px' }}>My Reviews ⭐</h1>
            <p style={{ color: '#bbdefb', fontSize: 15, margin: 0 }}>Track and manage the feedback you've left for doctors</p>
          </div>
          <button
            onClick={() => navigate('/doctors')}
            style={{ background: '#fff', color: '#1565c0', fontWeight: 700, fontSize: 14, padding: '13px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', alignSelf: 'flex-end', marginBottom: 4 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e3f2fd'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            + Find Doctors
          </button>
        </div>
      </div>

      {/* Stats Strip — floats over hero */}
      <div style={{ maxWidth: 1100, margin: '-36px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Reviews',  value: loading ? '…' : reviews.length, icon: '📝', color: '#1565c0', bg: '#e3f2fd', sub: 'Submitted by you' },
            { label: 'Avg Rating',     value: loading ? '…' : avgRating,       icon: '⭐', color: '#f59e0b', bg: '#fff8e1', sub: 'Across all doctors' },
            { label: 'Doctors Rated',  value: loading ? '…' : new Set(reviews.map(r => r.doctor?._id)).size, icon: '👨‍⚕️', color: '#2e7d32', bg: '#e8f5e9', sub: 'Unique specialists' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 4px 20px rgba(21,101,192,0.08)', border: '1.5px solid #e8edf5', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <p style={{ color: s.color, fontWeight: 800, fontSize: 24, margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: '#1a2744', fontWeight: 700, fontSize: 13, margin: '3px 0 2px' }}>{s.label}</p>
                <p style={{ color: '#90a4ae', fontSize: 11, margin: 0 }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* Error */}
        {error && (
          <div style={{ background: '#ffebee', border: '1.5px solid #ef9a9a', borderRadius: 12, padding: '14px 18px', marginBottom: 24, color: '#c62828', fontSize: 13, fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 14 }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e3f2fd', borderTop: '3px solid #1565c0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#90a4ae', fontSize: 14 }}>Loading your reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '72px 32px', textAlign: 'center', boxShadow: '0 4px 20px rgba(21,101,192,0.06)', border: '1.5px solid #e8edf5' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>⭐</div>
            <h3 style={{ color: '#1a2744', fontWeight: 700, fontSize: 20, margin: '0 0 8px' }}>No reviews yet</h3>
            <p style={{ color: '#90a4ae', fontSize: 14, margin: '0 0 28px' }}>After visiting a doctor, leave your feedback to help others</p>
            <button
              onClick={() => navigate('/doctors')}
              style={{ background: 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '13px 28px', borderRadius: 12, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(21,101,192,0.3)' }}
            >
              Find a Doctor
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {reviews.map((review) => (
              <div
                key={review._id}
                style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8edf5', padding: '24px 28px', boxShadow: '0 2px 12px rgba(21,101,192,0.05)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(21,101,192,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(21,101,192,0.05)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>

                  {/* Left: doctor info + stars + comment */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1, minWidth: 0 }}>
                    {/* Avatar */}
                    <div style={{ width: 54, height: 54, borderRadius: 14, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 22, flexShrink: 0, boxShadow: '0 4px 12px rgba(21,101,192,0.25)' }}>
                      {(review.doctor?.user?.name || 'D').charAt(0).toUpperCase()}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                        <p style={{ color: '#1a2744', fontWeight: 800, fontSize: 15, margin: 0 }}>
                          Dr. {review.doctor?.user?.name || 'Doctor'}
                        </p>
                        {review.doctor?.specialization && (
                          <span style={{ background: '#e3f2fd', color: '#1565c0', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                            {review.doctor.specialization}
                          </span>
                        )}
                      </div>

                      {/* Stars */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 12 }}>
                        {renderStars(review.rating)}
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', marginLeft: 8 }}>{review.rating}/5</span>
                      </div>

                      {/* Comment */}
                      <div style={{ background: '#f8faff', borderRadius: 10, padding: '12px 16px', borderLeft: '3px solid #1565c0' }}>
                        <p style={{ fontSize: 14, color: '#455a64', margin: 0, lineHeight: 1.65 }}>
                          {review.comment || <span style={{ color: '#bdbdbd', fontStyle: 'italic' }}>No comment left.</span>}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: date + delete */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: '#90a4ae', fontWeight: 500, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                      📅 {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => deleteReview(review._id)}
                      disabled={deletingId === review._id}
                      style={{
                        fontSize: 12, fontWeight: 700,
                        color: deletingId === review._id ? '#bdbdbd' : '#ef4444',
                        background: deletingId === review._id ? '#f5f5f5' : 'rgba(239,68,68,0.07)',
                        border: '1.5px solid',
                        borderColor: deletingId === review._id ? '#e0e0e0' : 'rgba(239,68,68,0.2)',
                        borderRadius: 9, padding: '7px 14px',
                        cursor: deletingId === review._id ? 'not-allowed' : 'pointer',
                        transition: 'all 0.18s',
                      }}
                      onMouseEnter={e => { if (deletingId !== review._id) { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#ef4444' } }}
                      onMouseLeave={e => { if (deletingId !== review._id) { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)' } }}
                    >
                      {deletingId === review._id ? '⏳ Deleting…' : '🗑 Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

export default MyReviewsPage