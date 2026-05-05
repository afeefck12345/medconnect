import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/authSlice'

const devicesAreDifferent = (currentValue, nextValue) => currentValue !== nextValue

const DoctorVideoSettingsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [audioInputs, setAudioInputs] = useState([])
  const [videoInputs, setVideoInputs] = useState([])
  const [selectedAudio, setSelectedAudio] = useState('')
  const [selectedVideo, setSelectedVideo] = useState('')
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true)
  const [permissionState, setPermissionState] = useState('checking')
  const [previewStream, setPreviewStream] = useState(null)
  const [error, setError] = useState('')
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const navLinks = [
    { label: 'Dashboard', path: '/doctor/dashboard' },
    { label: 'Appointments', path: '/doctor/appointments' },
    { label: 'Schedule', path: '/doctor/schedule' },
    { label: 'Profile', path: '/doctor/profile' },
  ]

  useEffect(() => {
    const loadDevices = async () => {
      setPermissionState('checking')
      setError('')
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        const devices = await navigator.mediaDevices.enumerateDevices()
        const microphones = devices.filter((d) => d.kind === 'audioinput')
        const cameras = devices.filter((d) => d.kind === 'videoinput')
        setAudioInputs(microphones)
        setVideoInputs(cameras)
        setSelectedAudio((c) => c || microphones[0]?.deviceId || '')
        setSelectedVideo((c) => c || cameras[0]?.deviceId || '')
        setPermissionState('granted')
        tempStream.getTracks().forEach((t) => t.stop())
      } catch {
        setPermissionState('denied')
        setError('Camera or microphone access was denied. Please allow access in your browser settings.')
      }
    }
    loadDevices()
  }, [])

  useEffect(() => {
    const startPreview = async () => {
      if (permissionState !== 'granted') return
      try {
        if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: microphoneEnabled ? (selectedAudio ? { deviceId: { exact: selectedAudio } } : true) : false,
          video: cameraEnabled ? (selectedVideo ? { deviceId: { exact: selectedVideo } } : true) : false,
        })
        streamRef.current = stream
        setPreviewStream(stream)
      } catch {
        setError('Could not start camera preview with the selected devices.')
      }
    }
    startPreview()
    return () => {
      if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null }
    }
  }, [cameraEnabled, microphoneEnabled, permissionState, selectedAudio, selectedVideo])

  useEffect(() => {
    if (videoRef.current && previewStream) videoRef.current.srcObject = previewStream
  }, [previewStream])

  const permissionBadge = {
    granted: { bg: '#e8f5e9', color: '#2e7d32', label: 'Ready' },
    denied:  { bg: '#ffebee', color: '#c62828', label: 'Permission Needed' },
    checking:{ bg: '#fff8e1', color: '#f57f17', label: 'Checking…' },
  }[permissionState]

  const selectStyle = {
    width: '100%',
    padding: '11px 16px',
    border: '1.5px solid #e8edf5',
    borderRadius: 10,
    fontSize: 13,
    color: '#1a2744',
    background: '#f8faff',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    appearance: 'none',
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
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>Med<span style={{ color: '#90caf9' }}>Connect</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{ background: 'transparent', border: 'none', color: '#cfe2ff', fontWeight: 500, fontSize: 14, padding: '8px 16px', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#cfe2ff' }}
              >
                {link.label}
              </button>
            ))}
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
      <div style={{ background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #0d47a1 100%)', padding: '48px 0 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '40%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(144,202,249,0.15)', border: '1px solid rgba(144,202,249,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4fc3f7' }} />
              <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 600 }}>Doctor Portal</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, lineHeight: 1.2, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
              Video Consultation Setup
            </h1>
            <p style={{ color: '#bbdefb', fontSize: 15, margin: 0 }}>
              Test your camera, microphone, and preferences before joining a patient call
            </p>
          </div>
          <button
            onClick={() => navigate('/doctor/appointments')}
            style={{ background: '#fff', color: '#1565c0', fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Go to Appointments →
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '-32px auto 0', padding: '0 24px 64px', position: 'relative', zIndex: 10 }}>

        {/* Error */}
        {error && (
          <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', borderRadius: 10, padding: '12px 18px', marginBottom: 20, fontSize: 13, fontWeight: 500 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Two-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* Left: Preview Card */}
          <div style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 18, padding: '28px', boxShadow: '0 8px 40px rgba(21,101,192,0.10)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📹</div>
                <div>
                  <h2 style={{ color: '#1a2744', fontWeight: 700, fontSize: 16, margin: 0 }}>Device Preview</h2>
                  <p style={{ color: '#90a4ae', fontSize: 12, margin: 0, marginTop: 2 }}>Live feed from your camera</p>
                </div>
              </div>
              <span style={{ background: permissionBadge.bg, color: permissionBadge.color, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
                {permissionBadge.label}
              </span>
            </div>

            {/* Video Preview */}
            <div style={{ borderRadius: 14, overflow: 'hidden', background: '#1a2744', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative' }}>
              {cameraEnabled ? (
                <video
                  ref={(el) => { videoRef.current = el }}
                  autoPlay muted playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
                  <p style={{ color: '#90caf9', fontWeight: 700, fontSize: 15, margin: 0 }}>Camera is off</p>
                  <p style={{ color: '#546e7a', fontSize: 12, marginTop: 6 }}>Turn it on to preview your video feed.</p>
                </div>
              )}
            </div>

            {/* Toggle Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button
                onClick={() => setCameraEnabled((c) => !c)}
                style={{
                  padding: '11px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: cameraEnabled ? 'linear-gradient(135deg, #1565c0, #1976d2)' : '#f0f4fa',
                  color: cameraEnabled ? '#fff' : '#546e7a',
                  boxShadow: cameraEnabled ? '0 4px 14px rgba(21,101,192,0.25)' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {cameraEnabled ? '📷 Turn Camera Off' : '📷 Turn Camera On'}
              </button>
              <button
                onClick={() => setMicrophoneEnabled((c) => !c)}
                style={{
                  padding: '11px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: microphoneEnabled ? 'linear-gradient(135deg, #1565c0, #1976d2)' : '#f0f4fa',
                  color: microphoneEnabled ? '#fff' : '#546e7a',
                  boxShadow: microphoneEnabled ? '0 4px 14px rgba(21,101,192,0.25)' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {microphoneEnabled ? '🎙️ Mute Mic' : '🎙️ Unmute Mic'}
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Device Selection */}
            <div style={{ background: '#fff', border: '1.5px solid #e8edf5', borderRadius: 18, padding: '28px', boxShadow: '0 2px 12px rgba(21,101,192,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #1565c0, #42a5f5)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🔧</div>
                <div>
                  <h2 style={{ color: '#1a2744', fontWeight: 700, fontSize: 16, margin: 0 }}>Device Selection</h2>
                  <p style={{ color: '#90a4ae', fontSize: 12, margin: 0, marginTop: 2 }}>Choose your camera and microphone</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Camera Select */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1a2744', marginBottom: 8 }}>
                    📷 Camera
                  </label>
                  <select
                    value={selectedVideo}
                    onChange={(e) => { if (devicesAreDifferent(selectedVideo, e.target.value)) setSelectedVideo(e.target.value) }}
                    style={selectStyle}
                    onFocus={e => e.target.style.borderColor = '#1565c0'}
                    onBlur={e => e.target.style.borderColor = '#e8edf5'}
                  >
                    {videoInputs.length === 0 ? (
                      <option value="">No camera detected</option>
                    ) : (
                      videoInputs.map((d, i) => (
                        <option key={d.deviceId || i} value={d.deviceId}>{d.label || `Camera ${i + 1}`}</option>
                      ))
                    )}
                  </select>
                </div>

                {/* Microphone Select */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1a2744', marginBottom: 8 }}>
                    🎙️ Microphone
                  </label>
                  <select
                    value={selectedAudio}
                    onChange={(e) => { if (devicesAreDifferent(selectedAudio, e.target.value)) setSelectedAudio(e.target.value) }}
                    style={selectStyle}
                    onFocus={e => e.target.style.borderColor = '#1565c0'}
                    onBlur={e => e.target.style.borderColor = '#e8edf5'}
                  >
                    {audioInputs.length === 0 ? (
                      <option value="">No microphone detected</option>
                    ) : (
                      audioInputs.map((d, i) => (
                        <option key={d.deviceId || i} value={d.deviceId}>{d.label || `Microphone ${i + 1}`}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Consultation Checklist */}
            <div style={{ background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)', borderRadius: 18, padding: '28px', boxShadow: '0 4px 20px rgba(21,101,192,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>✅</div>
                <div>
                  <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 }}>Consultation Checklist</h2>
                  <p style={{ color: '#90caf9', fontSize: 12, margin: 0, marginTop: 2 }}>Before joining your patient call</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { n: 1, text: 'Check camera framing and lighting before joining a patient call.' },
                  { n: 2, text: 'Use the appointment screen to open confirmed video consultations directly.' },
                  { n: 3, text: 'After the call, write the prescription from the doctor prescription module.' },
                ].map(({ n, text }) => (
                  <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                      {n}
                    </span>
                    <p style={{ color: '#bbdefb', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Strip */}
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
              <span
                key={link}
                style={{ color: '#78909c', fontSize: 12, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#90caf9'}
                onMouseLeave={e => e.target.style.color = '#78909c'}
              >
                {link}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorVideoSettingsPage