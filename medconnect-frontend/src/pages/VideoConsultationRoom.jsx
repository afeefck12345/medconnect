import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import API from '../api/axios'

const parseTimeSlotToDate = (dateValue, timeSlot) => {
  if (!dateValue || !timeSlot) return null
  const match = timeSlot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!match) return null
  const [, hoursText, minutesText, meridiem] = match
  let hours = Number(hoursText)
  const minutes = Number(minutesText)
  if (meridiem.toUpperCase() === 'PM' && hours !== 12) hours += 12
  if (meridiem.toUpperCase() === 'AM' && hours === 12) hours = 0
  const appointmentStart = new Date(dateValue)
  appointmentStart.setHours(hours, minutes, 0, 0)
  return appointmentStart
}

const VideoConsultationRoom = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useSelector((state) => state.auth)
  const jitsiContainer = useRef(null)
  const jitsiApi = useRef(null)

  const appointmentId = searchParams.get('appointmentId') || ''
  const doctorName    = searchParams.get('doctorName')    || 'Doctor'
  const patientName   = searchParams.get('patientName')   || 'Patient'
  const roomName      = `medconnect-${appointmentId || 'room'}`

  const [status, setStatus]                     = useState('validating')
  const [participantCount, setParticipantCount] = useState(0)
  const [isMuted, setIsMuted]                   = useState(false)
  const [isVideoOff, setIsVideoOff]             = useState(false)
  const [duration, setDuration]                 = useState(0)
  const [appointment, setAppointment]           = useState(null)
  const [gateMessage, setGateMessage]           = useState('')

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
        BRAND_WATERMARK_LINK: '',
        DEFAULT_BACKGROUND: '#0d1a3a',
      },
    }
    try {
      jitsiApi.current = new window.JitsiMeetExternalAPI('meet.jit.si', options)
      jitsiApi.current.addEventListener('videoConferenceJoined', () => setStatus('ready'))
      jitsiApi.current.addEventListener('videoConferenceLeft',   () => setStatus('ended'))
      jitsiApi.current.addEventListener('participantJoined', () => setParticipantCount((c) => c + 1))
      jitsiApi.current.addEventListener('participantLeft',   () => setParticipantCount((c) => Math.max(0, c - 1)))
      jitsiApi.current.addEventListener('audioMuteStatusChanged', ({ muted }) => setIsMuted(muted))
      jitsiApi.current.addEventListener('videoMuteStatusChanged', ({ muted }) => setIsVideoOff(muted))
    } catch { setStatus('error') }
  }

  useEffect(() => {
    const validateAndLoadAppointment = async () => {
      if (!appointmentId) {
        setGateMessage('A valid appointment is required to join a consultation.')
        setStatus('blocked'); return
      }
      try {
        const { data } = await API.get(`/appointments/${appointmentId}`)
        const appointmentStart  = parseTimeSlotToDate(data.date, data.timeSlot)
        const now               = new Date()
        const openWindowStart   = appointmentStart ? new Date(appointmentStart.getTime() - 30 * 60 * 1000) : null
        const openWindowEnd     = appointmentStart ? new Date(appointmentStart.getTime() + 3 * 60 * 60 * 1000) : null

        if (data.type !== 'video') {
          setGateMessage('This appointment is not configured as a video consultation.')
          setStatus('blocked'); return
        }
        if (data.status !== 'confirmed') {
          setGateMessage('The consultation room becomes available after the appointment is confirmed.')
          setStatus('blocked'); return
        }
        if (openWindowStart && now < openWindowStart) {
          setGateMessage('You can join the video room up to 30 minutes before the scheduled appointment time.')
          setAppointment(data); setStatus('blocked'); return
        }
        if (openWindowEnd && now > openWindowEnd) {
          setGateMessage('This consultation room is no longer available because the appointment window has ended.')
          setAppointment(data); setStatus('blocked'); return
        }
        setAppointment(data)
        setStatus('connecting')
      } catch (error) {
        setGateMessage(error.response?.data?.message || 'Could not validate this consultation room.')
        setStatus('blocked')
      }
    }
    validateAndLoadAppointment()
  }, [appointmentId])

  useEffect(() => {
    if (status !== 'connecting') return
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
  }, [status])

  useEffect(() => {
    let timer
    if (status === 'ready') timer = setInterval(() => setDuration((c) => c + 1), 1000)
    return () => clearInterval(timer)
  }, [status])

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleLeave = () => {
    if (jitsiApi.current) jitsiApi.current.executeCommand('hangup')
    setStatus('ended')
  }

  const goBack = () => navigate(user?.role === 'doctor' ? '/doctor/appointments' : '/appointments')

  // Shared overlay styles using MedConnect palette
  const overlayCard = { textAlign: 'center', maxWidth: 400, padding: '0 24px', fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }
  const overlayTitle = { fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.4px', margin: '0 0 10px' }
  const overlaySubtitle = { fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 0 28px' }

  const btnPrimary = {
    background: 'linear-gradient(135deg, #1565c0, #1976d2)',
    color: '#fff', fontWeight: 700, padding: '12px 24px',
    borderRadius: 10, border: 'none', cursor: 'pointer',
    fontSize: 14, transition: 'opacity 0.2s',
    boxShadow: '0 4px 16px rgba(21,101,192,0.35)',
    fontFamily: "'Segoe UI', sans-serif",
  }
  const btnSecondary = {
    background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)',
    fontWeight: 600, padding: '12px 24px', borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
    fontSize: 14, transition: 'all 0.2s',
    fontFamily: "'Segoe UI', sans-serif",
  }

  const iconBox = (extra = {}) => ({
    width: 72, height: 72, borderRadius: 20,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 32, margin: '0 auto 24px', ...extra,
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0d1a3a', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>

      {/* ── Top Bar ── */}
      <div style={{ background: '#1a2744', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 10 }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 38, height: 38, background: '#1565c0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#fff"/>
            </svg>
          </div>
          <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.1)' }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
              Med<span style={{ color: '#90caf9' }}>Connect</span>
              <span style={{ color: '#546e7a', fontWeight: 500, fontSize: 13, marginLeft: 8 }}>— Video Consultation</span>
            </div>
            <div style={{ fontSize: 12, color: '#546e7a', marginTop: 1 }}>
              {user?.role === 'patient' ? `With Dr. ${doctorName}` : `With ${patientName}`}
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {status === 'ready' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(21,101,192,0.2)', border: '1px solid rgba(144,202,249,0.25)', borderRadius: 20, padding: '5px 14px' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4fc3f7', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#90caf9', fontVariantNumeric: 'tabular-nums' }}>{formatDuration(duration)}</span>
              </div>
              {participantCount > 0 && (
                <span style={{ fontSize: 12, color: '#546e7a' }}>👥 {participantCount + 1} participants</span>
              )}
              {[
                { on: !isMuted,    onLabel: '🎙️ Mic On',  offLabel: '🔇 Muted',   off: isMuted },
                { on: !isVideoOff, onLabel: '📹 Cam On',  offLabel: '📷 Cam Off', off: isVideoOff },
              ].map((pill, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: pill.off ? 'rgba(239,83,80,0.15)' : 'rgba(255,255,255,0.07)', color: pill.off ? '#ef9a9a' : '#78909c', border: pill.off ? '1px solid rgba(239,83,80,0.3)' : '1px solid rgba(255,255,255,0.1)' }}>
                  {pill.off ? pill.offLabel : pill.onLabel}
                </span>
              ))}
            </>
          )}
          {status === 'validating' && (
            <span style={{ fontSize: 13, fontWeight: 600, color: '#90caf9', animation: 'pulse 2s infinite' }}>● Validating appointment…</span>
          )}
          {status === 'connecting' && (
            <span style={{ fontSize: 13, fontWeight: 600, color: '#90caf9', animation: 'pulse 2s infinite' }}>● Connecting…</span>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, position: 'relative', background: '#0d1a3a' }}>

        {/* Validating / Connecting */}
        {(status === 'validating' || status === 'connecting') && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <div style={overlayCard}>
              <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 24px' }}>
                <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '3px solid rgba(21,101,192,0.35)', animation: 'spin 1.4s linear infinite' }} />
                <div style={{ ...iconBox({ margin: 0 }), background: 'linear-gradient(135deg, #1565c0, #1976d2)', boxShadow: '0 0 36px rgba(21,101,192,0.45)' }}>
                  🎥
                </div>
              </div>
              <div style={overlayTitle}>
                {status === 'validating' ? 'Checking your appointment…' : 'Setting up your consultation…'}
              </div>
              <div style={overlaySubtitle}>
                {status === 'validating'
                  ? 'Please wait while we validate room access.'
                  : 'Please allow camera and microphone access when prompted.'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {[0.4, 0.65, 0.9].map((op, i) => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#1565c0', opacity: op }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Blocked */}
        {status === 'blocked' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <div style={overlayCard}>
              <div style={iconBox({ background: 'rgba(255,183,77,0.12)', border: '1px solid rgba(255,183,77,0.25)' })}>⏳</div>
              <div style={overlayTitle}>Consultation Not Available</div>
              <div style={overlaySubtitle}>{gateMessage}</div>
              {appointment && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', marginBottom: 24 }}>
                  Scheduled for {new Date(appointment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} at {appointment.timeSlot}
                </div>
              )}
              <button
                onClick={goBack}
                style={btnSecondary}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                ← Back to Appointments
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <div style={overlayCard}>
              <div style={iconBox({ background: 'rgba(239,83,80,0.12)', border: '1px solid rgba(239,83,80,0.25)' })}>⚠️</div>
              <div style={overlayTitle}>Could Not Load Video Call</div>
              <div style={overlaySubtitle}>Please check your internet connection and try again.</div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button
                  onClick={() => window.location.reload()}
                  style={btnPrimary}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Retry
                </button>
                <button
                  onClick={goBack}
                  style={btnSecondary}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ended */}
        {status === 'ended' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <div style={overlayCard}>
              <div style={iconBox({ background: 'linear-gradient(135deg, #1565c0, #42a5f5)', boxShadow: '0 8px 32px rgba(21,101,192,0.4)' })}>✅</div>
              <div style={overlayTitle}>Consultation Ended</div>

              {/* Duration badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(21,101,192,0.15)', border: '1px solid rgba(144,202,249,0.25)', borderRadius: 20, padding: '6px 18px', marginBottom: 16 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Duration</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#90caf9', fontVariantNumeric: 'tabular-nums' }}>{formatDuration(duration)}</span>
              </div>

              <div style={overlaySubtitle}>
                {user?.role === 'patient'
                  ? 'Your consultation is complete. Check your prescriptions for any medicines prescribed.'
                  : 'You can now write a prescription for this patient from the prescriptions panel.'}
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={goBack}
                  style={btnSecondary}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                  ← Appointments
                </button>
                {user?.role === 'doctor' && (
                  <button
                    onClick={() => navigate('/doctor/prescriptions')}
                    style={btnPrimary}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Write Prescription →
                  </button>
                )}
                {user?.role === 'patient' && (
                  <button
                    onClick={() => navigate('/prescriptions')}
                    style={btnPrimary}
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

        {/* Jitsi iframe */}
        <div
          ref={jitsiContainer}
          style={{ width: '100%', minHeight: 'calc(100vh - 121px)', display: status === 'ready' ? 'block' : 'none' }}
        />
      </div>

      {/* ── Bottom Bar (active call only) ── */}
      {status === 'ready' && (
        <div style={{ background: '#1a2744', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <p style={{ color: '#546e7a', fontSize: 12, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" fill="none" stroke="#546e7a" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            Secure room · End-to-end encrypted · Powered by Jitsi Meet
          </p>
          <button
            onClick={handleLeave}
            style={{ background: 'linear-gradient(135deg, #e53935, #ef5350)', color: '#fff', fontWeight: 700, fontSize: 13, padding: '9px 22px', borderRadius: 9, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 3px 12px rgba(229,57,53,0.35)', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
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

export default VideoConsultationRoom