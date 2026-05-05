import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/authSlice'
import API from '../../api/axios'

const PrescriptionsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const printRef = useRef(null)

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/prescriptions/my')
      setPrescriptions(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handlePrint = () => {
    const content = printRef.current
    if (!content) return
    const win = window.open('', '_blank')
    win.document.write(`
      <html>
        <head>
          <title>Prescription — MedConnect</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #111; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1565c0; padding-bottom: 16px; margin-bottom: 24px; }
            .brand { font-size: 22px; font-weight: bold; color: #1565c0; }
            .brand-sub { font-size: 12px; color: #666; }
            .rx-symbol { font-size: 40px; color: #1565c0; font-style: italic; font-weight: bold; }
            .section { margin-bottom: 20px; }
            .label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
            .value { font-size: 14px; color: #111; font-weight: 500; }
            .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
            .medicine-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .medicine-table th { background: #e3f2fd; text-align: left; padding: 10px 12px; font-size: 12px; color: #1565c0; border-bottom: 1px solid #bbdefb; }
            .medicine-table td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #f3f4f6; }
            .medicine-table tr:last-child td { border-bottom: none; }
            .notes-box { background: #f8faff; border: 1px solid #e3f2fd; border-radius: 8px; padding: 14px; margin-bottom: 24px; font-size: 13px; color: #374151; }
            .footer { border-top: 1px solid #e3f2fd; padding-top: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
            .signature-line { border-top: 1px solid #111; width: 180px; margin-top: 40px; padding-top: 6px; font-size: 12px; color: #666; text-align: center; }
            .diagnosis-badge { display: inline-block; background: #e3f2fd; color: #1565c0; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 500)
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
                style={{ background: 'transparent', border: 'none', color: '#cfe2ff', fontWeight: 500, fontSize: 14, padding: '8px 16px', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#cfe2ff' }}
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => navigate('/prescriptions')}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 14, padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}
            >
              Prescriptions
            </button>
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
      <div style={{ background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)', padding: '48px 0 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '20%', width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7' }} />
            <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 600 }}>Medical Records</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>My Prescriptions</h1>
          <p style={{ color: '#bbdefb', fontSize: 15, margin: 0 }}>View, download and print your digital prescriptions</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 900, margin: '-40px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 10 }}>

        {/* Prescription Detail Modal */}
        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,20,50,0.6)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 100, padding: '32px 16px', overflowY: 'auto' }}>
            <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 680, boxShadow: '0 24px 80px rgba(21,101,192,0.25)', margin: 'auto' }}>

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid #e8edf5' }}>
                <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 18, margin: 0 }}>Prescription Details</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    onClick={handlePrint}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Download / Print
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    style={{ width: 36, height: 36, borderRadius: 8, border: '1.5px solid #e8edf5', background: '#f8faff', color: '#546e7a', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 400, lineHeight: 1 }}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Printable Content */}
              <div ref={printRef} style={{ padding: '28px' }}>

                {/* Prescription Letterhead */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '2px solid #1565c0', paddingBottom: 20, marginBottom: 24 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <div style={{ width: 32, height: 32, background: '#1565c0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#fff"/></svg>
                      </div>
                      <span style={{ fontWeight: 800, color: '#1565c0', fontSize: 18 }}>MedConnect</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#90a4ae', margin: 0 }}>Digital Medical Prescription</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 44, fontWeight: 800, color: '#1565c0', fontStyle: 'italic', margin: 0, lineHeight: 1 }}>℞</p>
                    <p style={{ fontSize: 12, color: '#90a4ae', margin: '4px 0 0' }}>
                      {new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Doctor / Patient / Diagnosis */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
                  {[
                    { label: 'Doctor', main: `Dr. ${selected.doctor?.name || 'Doctor'}`, sub: selected.doctor?.specialization },
                    { label: 'Patient', main: selected.patient?.name || user?.name, sub: selected.patient?.email },
                  ].map((info, i) => (
                    <div key={i}>
                      <p style={{ fontSize: 11, color: '#90a4ae', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 6px', fontWeight: 600 }}>{info.label}</p>
                      <p style={{ fontWeight: 700, color: '#1a2744', fontSize: 14, margin: '0 0 2px' }}>{info.main}</p>
                      <p style={{ fontSize: 12, color: '#78909c', margin: 0 }}>{info.sub}</p>
                    </div>
                  ))}
                  <div>
                    <p style={{ fontSize: 11, color: '#90a4ae', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 6px', fontWeight: 600 }}>Diagnosis</p>
                    <span style={{ display: 'inline-block', background: '#e3f2fd', color: '#1565c0', fontSize: 13, fontWeight: 600, padding: '5px 14px', borderRadius: 20 }}>
                      {selected.diagnosis}
                    </span>
                  </div>
                </div>

                {/* Medicines Table */}
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 11, color: '#90a4ae', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px', fontWeight: 600 }}>Prescribed Medicines</p>
                  <div style={{ border: '1.5px solid #e8edf5', borderRadius: 14, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#e3f2fd' }}>
                          {['#', 'Medicine', 'Dosage', 'Frequency', 'Duration'].map(h => (
                            <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#1565c0', padding: '11px 14px' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selected.medicines?.map((med, i) => (
                          <tr key={i} style={{ borderTop: '1px solid #f0f4fa' }}>
                            <td style={{ padding: '11px 14px', fontSize: 12, color: '#90a4ae' }}>{i + 1}</td>
                            <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 700, color: '#1a2744' }}>{med.name}</td>
                            <td style={{ padding: '11px 14px', fontSize: 13, color: '#546e7a' }}>{med.dosage || '—'}</td>
                            <td style={{ padding: '11px 14px', fontSize: 13, color: '#546e7a' }}>{med.frequency || '—'}</td>
                            <td style={{ padding: '11px 14px', fontSize: 13, color: '#546e7a' }}>{med.duration || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Notes */}
                {selected.notes && (
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 11, color: '#90a4ae', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 10px', fontWeight: 600 }}>Doctor's Notes</p>
                    <div style={{ background: '#f8faff', border: '1.5px solid #e3f2fd', borderRadius: 12, padding: '14px 18px' }}>
                      <p style={{ fontSize: 13, color: '#455a64', margin: 0, lineHeight: 1.6 }}>{selected.notes}</p>
                    </div>
                  </div>
                )}

                {/* Prescription Footer */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderTop: '1px solid #e8edf5', paddingTop: 16, marginTop: 8 }}>
                  <p style={{ fontSize: 11, color: '#90a4ae', margin: 0 }}>This is a digitally generated prescription from MedConnect.</p>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ borderTop: '1.5px solid #1a2744', width: 160, marginBottom: 6, marginLeft: 'auto' }} />
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1a2744', margin: 0 }}>Dr. {selected.doctor?.name}</p>
                    <p style={{ fontSize: 11, color: '#78909c', margin: '2px 0 0' }}>{selected.doctor?.specialization}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prescriptions List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0', gap: 12 }}>
            <div style={{ width: 36, height: 36, border: '3px solid #e3f2fd', borderTop: '3px solid #1565c0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#90a4ae', fontSize: 14 }}>Loading prescriptions...</span>
          </div>
        ) : prescriptions.length === 0 ? (
          <div style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 20, padding: '64px 32px', textAlign: 'center', boxShadow: '0 8px 40px rgba(21,101,192,0.08)' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>℞</div>
            <p style={{ color: '#90a4ae', fontSize: 15, marginBottom: 24 }}>No prescriptions yet</p>
            <button
              onClick={() => navigate('/appointments')}
              style={{ background: 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(21,101,192,0.25)' }}
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {prescriptions.map((rx) => (
              <div
                key={rx._id}
                onClick={() => setSelected(rx)}
                style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 18, padding: '24px 28px', cursor: 'pointer', transition: 'all 0.25s', boxShadow: '0 2px 12px rgba(21,101,192,0.05)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(21,101,192,0.13)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(21,101,192,0.05)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 54, height: 54, borderRadius: 14, background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1565c0', fontWeight: 800, fontSize: 24, flexShrink: 0 }}>
                      ℞
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, color: '#1a2744', fontSize: 15, margin: '0 0 3px' }}>Dr. {rx.doctor?.name || 'Doctor'}</p>
                      <p style={{ fontSize: 12, color: '#1565c0', fontWeight: 600, margin: '0 0 5px' }}>{rx.doctor?.specialization}</p>
                      <p style={{ fontSize: 12, color: '#90a4ae', margin: 0 }}>
                        📅 {new Date(rx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span style={{ background: '#e3f2fd', color: '#1565c0', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 20 }}>
                      {rx.diagnosis}
                    </span>
                    <span style={{ fontSize: 12, color: '#78909c' }}>
                      💊 {rx.medicines?.length || 0} medicine{rx.medicines?.length !== 1 ? 's' : ''}
                    </span>
                    <span style={{ fontSize: 12, color: '#1565c0', fontWeight: 600 }}>View & Download →</span>
                  </div>
                </div>

                {/* Medicine Tags */}
                {rx.medicines?.length > 0 && (
                  <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {rx.medicines.slice(0, 3).map((med, i) => (
                      <span key={i} style={{ fontSize: 12, background: '#f8faff', color: '#455a64', border: '1px solid #e8edf5', padding: '4px 12px', borderRadius: 20 }}>
                        {med.name}
                      </span>
                    ))}
                    {rx.medicines.length > 3 && (
                      <span style={{ fontSize: 12, color: '#90a4ae', padding: '4px 8px' }}>+{rx.medicines.length - 3} more</span>
                    )}
                  </div>
                )}
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
              <span key={link} style={{ color: '#78909c', fontSize: 12, cursor: 'pointer', transition: 'color 0.2s' }}
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

export default PrescriptionsPage