import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMyAppointments } from '../../features/appointment/appointmentSlice'
import { logout } from '../../features/auth/authSlice'
import API from '../../api/axios'

const navLinks = [
  { label: 'Dashboard',     path: '/doctor/dashboard' },
  { label: 'Appointments',  path: '/doctor/appointments' },
  { label: 'Schedule',      path: '/doctor/schedule' },
  { label: 'Prescriptions', path: '/doctor/prescriptions' },
  { label: 'Profile',       path: '/doctor/profile' },
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
}

const DoctorPrescriptionsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { appointments } = useSelector((state) => state.appointment)

  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading]     = useState(false)
  const [showForm, setShowForm]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    appointmentId: '',
    patientName: '',
    diagnosis: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
    notes: '',
  })

  useEffect(() => {
    dispatch(getMyAppointments())
    fetchPrescriptions()
  }, [dispatch])

  const fetchPrescriptions = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/prescriptions/doctor')
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

  const confirmedAppointments = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'completed'
  )

  const addMedicine = () =>
    setForm((p) => ({ ...p, medicines: [...p.medicines, { name: '', dosage: '', frequency: '', duration: '' }] }))

  const removeMedicine = (i) =>
    setForm((p) => ({ ...p, medicines: p.medicines.filter((_, idx) => idx !== i) }))

  const updateMedicine = (i, field, value) =>
    setForm((p) => {
      const meds = [...p.medicines]
      meds[i] = { ...meds[i], [field]: value }
      return { ...p, medicines: meds }
    })

  const handleAppointmentSelect = (id) => {
    const apt = confirmedAppointments.find((a) => a._id === id)
    setForm((p) => ({ ...p, appointmentId: id, patientName: apt?.patient?.name || '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await API.post('/prescriptions', form)
      setShowForm(false)
      setForm({ appointmentId: '', patientName: '', diagnosis: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '' }], notes: '' })
      fetchPrescriptions()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
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
      <div style={{ background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)', padding: '48px 0 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: 20, left: '60%', width: 150, height: 150, borderRadius: '50%', background: 'rgba(144,202,249,0.1)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 600 }}>Doctor Portal</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.5px' }}>Prescriptions</h1>
            <p style={{ color: '#bbdefb', fontSize: 15, margin: 0 }}>Write and manage patient prescriptions from confirmed appointments.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            style={{ background: '#fff', color: '#1565c0', fontWeight: 700, fontSize: 14, padding: '14px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            + New Prescription
          </button>
        </div>
      </div>

      {/* Stats strip floating over hero */}
      <div style={{ maxWidth: 1200, margin: '-32px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 32px', boxShadow: '0 8px 40px rgba(21,101,192,0.12)', border: '1px solid #e3f2fd', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { label: 'Total Prescriptions', value: prescriptions.length, icon: '💊' },
            { label: 'This Month',          value: prescriptions.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length, icon: '📅' },
            { label: 'Eligible Appointments', value: confirmedAppointments.length, icon: '✅' },
          ].map((s, i, arr) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '8px 0', borderRight: i < arr.length - 1 ? '1px solid #e8edf5' : 'none' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ color: '#1a2744', fontWeight: 800, fontSize: 22 }}>{s.value}</div>
              <div style={{ color: '#90a4ae', fontSize: 12, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 64px' }}>

        <div style={{ marginBottom: 28 }}>
          <p style={{ color: '#1565c0', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.2, margin: 0, marginBottom: 6 }}>Records</p>
          <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 26, margin: 0 }}>Written Prescriptions</h2>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0', gap: 12 }}>
            <div style={{ width: 36, height: 36, border: '3px solid #e3f2fd', borderTop: '3px solid #1565c0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#90a4ae', fontSize: 14 }}>Loading prescriptions...</span>
          </div>
        ) : prescriptions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>💊</div>
            <p style={{ color: '#90a4ae', fontSize: 15, marginBottom: 24 }}>No prescriptions written yet.</p>
            <button
              onClick={() => setShowForm(true)}
              style={{ background: 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '13px 28px', borderRadius: 10, border: 'none', cursor: 'pointer' }}
            >
              Write your first prescription
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {prescriptions.map((rx) => (
              <div
                key={rx._id}
                style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(21,101,192,0.05)', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565c0'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(21,101,192,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf5'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(21,101,192,0.05)' }}
              >
                {/* Card Header */}
                <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20, flexShrink: 0, boxShadow: '0 4px 14px rgba(21,101,192,0.25)' }}>
                      {rx.patient?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p style={{ color: '#1a2744', fontWeight: 800, fontSize: 16, margin: 0 }}>{rx.patient?.name || 'Patient'}</p>
                      <p style={{ color: '#546e7a', fontSize: 12, margin: '3px 0 0' }}>📅 {new Date(rx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <span style={{ background: '#fff', color: '#1565c0', fontWeight: 700, fontSize: 12, padding: '6px 16px', borderRadius: 20, border: '1.5px solid #bbdefb' }}>
                    {rx.diagnosis}
                  </span>
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px 24px' }}>
                  <p style={{ color: '#1565c0', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' }}>💊 Medicines</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {rx.medicines?.map((med, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8faff', borderRadius: 10, padding: '10px 14px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1565c0', flexShrink: 0 }} />
                        <span style={{ color: '#1a2744', fontWeight: 700, fontSize: 13 }}>{med.name}</span>
                        {med.dosage   && <span style={{ color: '#90a4ae', fontSize: 12 }}>· {med.dosage}</span>}
                        {med.frequency && <span style={{ color: '#90a4ae', fontSize: 12 }}>· {med.frequency}</span>}
                        {med.duration && <span style={{ color: '#90a4ae', fontSize: 12 }}>· {med.duration}</span>}
                      </div>
                    ))}
                  </div>
                  {rx.notes && (
                    <div style={{ marginTop: 14, padding: '12px 16px', background: '#f8faff', borderRadius: 10, borderLeft: '3px solid #1565c0' }}>
                      <p style={{ color: '#546e7a', fontSize: 13, margin: 0, lineHeight: 1.6 }}>📝 {rx.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(21,33,64,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px', overflowY: 'auto' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px', width: '100%', maxWidth: 560, boxShadow: '0 24px 80px rgba(21,101,192,0.2)', position: 'relative' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h2 style={{ color: '#1a2744', fontWeight: 800, fontSize: 20, margin: 0 }}>Write Prescription</h2>
                <p style={{ color: '#90a4ae', fontSize: 13, margin: '4px 0 0' }}>Fill in the details for the patient prescription</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                style={{ width: 36, height: 36, borderRadius: 10, background: '#f8faff', border: '1.5px solid #e8edf5', color: '#546e7a', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 400, lineHeight: 1 }}
              >×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Appointment */}
                <div>
                  <label style={{ color: '#1a2744', fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 8 }}>Select Appointment</label>
                  <select
                    value={form.appointmentId}
                    onChange={(e) => handleAppointmentSelect(e.target.value)}
                    required
                    style={{ ...inputStyle, appearance: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#1565c0'}
                    onBlur={e => e.target.style.borderColor = '#e8edf5'}
                  >
                    <option value="">— Select appointment —</option>
                    {confirmedAppointments.map((apt) => (
                      <option key={apt._id} value={apt._id}>
                        {apt.patient?.name} — {new Date(apt.date).toLocaleDateString()} {apt.timeSlot}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Diagnosis */}
                <div>
                  <label style={{ color: '#1a2744', fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 8 }}>Diagnosis</label>
                  <input
                    type="text"
                    value={form.diagnosis}
                    onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                    placeholder="e.g. Viral fever, Hypertension..."
                    required
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#1565c0'}
                    onBlur={e => e.target.style.borderColor = '#e8edf5'}
                  />
                </div>

                {/* Medicines */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <label style={{ color: '#1a2744', fontWeight: 700, fontSize: 13 }}>Medicines</label>
                    <button
                      type="button"
                      onClick={addMedicine}
                      style={{ background: '#e3f2fd', color: '#1565c0', fontWeight: 700, fontSize: 12, padding: '5px 14px', borderRadius: 8, border: 'none', cursor: 'pointer' }}
                    >+ Add Medicine</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {form.medicines.map((med, index) => (
                      <div key={index} style={{ background: '#f8faff', border: '1.5px solid #e8edf5', borderRadius: 12, padding: '14px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                          <input
                            type="text"
                            placeholder="Medicine name"
                            value={med.name}
                            onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                            style={{ ...inputStyle, gridColumn: '1 / -1', padding: '9px 14px', fontSize: 12 }}
                            onFocus={e => e.target.style.borderColor = '#1565c0'}
                            onBlur={e => e.target.style.borderColor = '#e8edf5'}
                          />
                          <input type="text" placeholder="Dosage" value={med.dosage}
                            onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                            style={{ ...inputStyle, padding: '9px 14px', fontSize: 12 }}
                            onFocus={e => e.target.style.borderColor = '#1565c0'}
                            onBlur={e => e.target.style.borderColor = '#e8edf5'}
                          />
                          <input type="text" placeholder="Frequency" value={med.frequency}
                            onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                            style={{ ...inputStyle, padding: '9px 14px', fontSize: 12 }}
                            onFocus={e => e.target.style.borderColor = '#1565c0'}
                            onBlur={e => e.target.style.borderColor = '#e8edf5'}
                          />
                          <input type="text" placeholder="Duration" value={med.duration}
                            onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                            style={{ ...inputStyle, padding: '9px 14px', fontSize: 12 }}
                            onFocus={e => e.target.style.borderColor = '#1565c0'}
                            onBlur={e => e.target.style.borderColor = '#e8edf5'}
                          />
                        </div>
                        {form.medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedicine(index)}
                            style={{ background: '#ffebee', color: '#c62828', fontWeight: 700, fontSize: 11, padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
                          >Remove</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label style={{ color: '#1a2744', fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 8 }}>Additional Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Rest advice, diet, follow-up..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                    onFocus={e => e.target.style.borderColor = '#1565c0'}
                    onBlur={e => e.target.style.borderColor = '#e8edf5'}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: submitting ? '#90a4ae' : 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '14px', borderRadius: 10, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity = '0.9' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  {submitting ? 'Saving...' : 'Save Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default DoctorPrescriptionsPage