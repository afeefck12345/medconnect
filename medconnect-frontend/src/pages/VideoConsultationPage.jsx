import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'

const VideoConsultationPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useSelector((state) => state.auth)
  const jitsiContainer = useRef(null)
  const jitsiApi = useRef(null)

  const appointmentId = searchParams.get('appointmentId') || 'medconnect-room'
  const doctorName = searchParams.get('doctor') || 'Doctor'
  const roomName = `medconnect-${appointmentId}`

  const [status, setStatus] = useState('connecting')
  const [participantCount, setParticipantCount] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    script.onload = () => initJitsi()
    script.onerror = () => setStatus('error')
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
      if (jitsiApi.current) jitsiApi.current.dispose()
    }
  }, [])

  useEffect(() => {
    let timer
    if (status === 'ready') {
      timer = setInterval(() => setDuration((d) => d + 1), 1000)
    }
    return () => clearInterval(timer)
  }, [status])

  const initJitsi = () => {
    if (!window.JitsiMeetExternalAPI) { setStatus('error'); return }
    const options = {
      roomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainer.current,
      userInfo: { displayName: user?.name || 'User', email: user?.email || '' },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableDeepLinking: true,
        prejoinPageEnabled: false,
        enableWelcomePage: false,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: ['microphone','camera','closedcaptions','desktop','fullscreen','fodeviceselection','hangup','chat','recording','settings','raisehand','videoquality','tileview'],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        DEFAULT_BACKGROUND: '#0d1a3a',
      },
    }
    try {
      jitsiApi.current = new window.JitsiMeetExternalAPI('meet.jit.si', options)
      jitsiApi.current.addEventListener('videoConferenceJoined', () => setStatus('ready'))
      jitsiApi.current.addEventListener('videoConferenceLeft', () => setStatus('ended'))
      jitsiApi.current.addEventListener('participantJoined', () => setParticipantCount((p) => p + 1))
      jitsiApi.current.addEventListener('participantLeft', () => setParticipantCount((p) => Math.max(0, p - 1)))
      jitsiApi.current.addEventListener('audioMuteStatusChanged', ({ muted }) => setIsMuted(muted))
      jitsiApi.current.addEventListener('videoMuteStatusChanged', ({ muted }) => setIsVideoOff(muted))
    } catch { setStatus('error') }
  }

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleLeave = () => {
    if (jitsiApi.current) jitsiApi.current.executeCommand('hangup')
    setStatus('ended')
  }

  const goBack = () => navigate(user?.role === 'doctor' ? '/doctor/appointments' : '/appointments')

  return (
    <div style={{ minHeight: '100vh', background: '#0d1a3a', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>

      {/* Top Bar */}
      <div style={{ background: '#1a2744', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, background: '#1565c0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#fff"/>
            </svg>
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: 15, margin: 0, letterSpacing: '-0.3px' }}>
              Med<span style={{ color: '#90caf9' }}>Connect</span>
              <span style={{ color: '#546e7a', fontWeight: 500, fontSize: 13, marginLeft: 8 }}>— Video Consultation</span>
            </p>
            <p style={{ color: '#78909c', fontSize: 12, margin: 0 }}>
              {user?.role === 'patient' ? `With Dr. ${doctorName}` : 'Patient Consultation'}
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {status === 'ready' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(21,101,192,0.2)', border: '1px solid rgba(144,202,249,0.25)', borderRadius: 20, padding: '5px 14px' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4fc3f7', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 700 }}>{formatDuration(duration)}</span>
              </div>
              {participantCount > 0 && (
                <span style={{ color: '#78909c', fontSize: 13 }}>👥 {participantCount + 1} participants</span>
              )}
              <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: isMuted ? 'rgba(239,83,80,0.15)' : 'rgba(255,255,255,0.07)', color: isMuted ? '#ef9a9a' : '#90a4ae', border: isMuted ? '1px solid rgba(239,83,80,0.3)' : '1px solid rgba(255,255,255,0.1)' }}>
                {isMuted ? '🔇 Muted' : '🎙️ Live'}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: isVideoOff ? 'rgba(239,83,80,0.15)' : 'rgba(255,255,255,0.07)', color: isVideoOff ? '#ef9a9a' : '#90a4ae', border: isVideoOff ? '1px solid rgba(239,83,80,0.3)' : '1px solid rgba(255,255,255,0.1)' }}>
                {isVideoOff ? '📷 Off' : '📹 On'}
              </span>
            </>
          )}
          {status === 'connecting' && (
            <span style={{ color: '#90caf9', fontSize: 13, fontWeight: 600, animation: 'pulse 2s infinite' }}>⏳ Connecting...</span>
          )}
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, position: 'relative' }}>

        {/* Connecting State */}
        {status === 'connecting' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, background: '#0d1a3a' }}>
            <div style={{ textAlign: 'center' }}>
              {/* Animated ring */}
              <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 28px' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(21,101,192,0.3)', animation: 'spin 1.2s linear infinite' }} />
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #1565c0, #1976d2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="36" height="36" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: '0 0 8px' }}>Setting up your consultation...</p>
              <p style={{ color: '#546e7a', fontSize: 14, margin: 0 }}>Please allow camera and microphone access</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, background: '#0d1a3a' }}>
            <div style={{ textAlign: 'center', maxWidth: 380, padding: '0 24px' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(239,83,80,0.15)', border: '2px solid rgba(239,83,80,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 32 }}>⚠️</div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 20, margin: '0 0 10px' }}>Could not load video call</p>
              <p style={{ color: '#546e7a', fontSize: 14, margin: '0 0 28px', lineHeight: 1.6 }}>Please check your internet connection and try again.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  onClick={() => window.location.reload()}
                  style={{ background: 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Retry
                </button>
                <button
                  onClick={goBack}
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#90a4ae', fontWeight: 600, fontSize: 14, padding: '11px 24px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#90a4ae' }}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ended State */}
        {status === 'ended' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, background: '#0d1a3a' }}>
            <div style={{ textAlign: 'center', maxWidth: 420, padding: '0 24px' }}>
              {/* Success circle */}
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #1565c0, #42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(21,101,192,0.4)', fontSize: 36 }}>✅</div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 24, margin: '0 0 10px', letterSpacing: '-0.5px' }}>Consultation Ended</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(21,101,192,0.15)', border: '1px solid rgba(144,202,249,0.25)', borderRadius: 20, padding: '6px 16px', marginBottom: 16 }}>
                <span style={{ color: '#90caf9', fontSize: 14, fontWeight: 700 }}>Duration: {formatDuration(duration)}</span>
              </div>
              <p style={{ color: '#546e7a', fontSize: 14, margin: '0 0 32px', lineHeight: 1.7 }}>
                {user?.role === 'patient'
                  ? 'Your consultation has been completed. Check your prescriptions for any medicines prescribed.'
                  : 'You can now write a prescription for this patient.'}
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={goBack}
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#90a4ae', fontWeight: 600, fontSize: 14, padding: '12px 24px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#90a4ae' }}
                >
                  Back to Appointments
                </button>
                {user?.role === 'doctor' && (
                  <button
                    onClick={() => navigate('/doctor/prescriptions')}
                    style={{ background: 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(21,101,192,0.35)', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Write Prescription →
                  </button>
                )}
                {user?.role === 'patient' && (
                  <button
                    onClick={() => navigate('/prescriptions')}
                    style={{ background: 'linear-gradient(135deg, #1565c0, #1976d2)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(21,101,192,0.35)', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    View Prescriptions →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Jitsi Container */}
        <div
          ref={jitsiContainer}
          style={{
            width: '100%',
            display: status === 'ended' || status === 'error' ? 'none' : 'block',
            minHeight: 'calc(100vh - 121px)'
          }}
        />
      </div>

      {/* Bottom Bar — visible when call is active */}
      {status === 'ready' && (
        <div style={{ background: '#1a2744', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <p style={{ color: '#546e7a', fontSize: 12, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" fill="none" stroke="#546e7a" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            End-to-end encrypted · Powered by Jitsi Meet
          </p>
          <button
            onClick={handleLeave}
            style={{ background: 'linear-gradient(135deg, #e53935, #ef5350)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '9px 22px', borderRadius: 9, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 3px 12px rgba(229,57,53,0.35)', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M16 8l-8 8M8 8l8 8"/></svg>
            Leave Call
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  )
}

export default VideoConsultationPage

