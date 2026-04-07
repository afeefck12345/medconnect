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

  const [status, setStatus] = useState('connecting') // connecting | ready | ended | error
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
      if (jitsiApi.current) {
        jitsiApi.current.dispose()
      }
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
    if (!window.JitsiMeetExternalAPI) {
      setStatus('error')
      return
    }

    const options = {
      roomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainer.current,
      userInfo: {
        displayName: user?.name || 'User',
        email: user?.email || '',
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableDeepLinking: true,
        prejoinPageEnabled: false,
        enableWelcomePage: false,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop',
          'fullscreen', 'fodeviceselection', 'hangup', 'chat',
          'recording', 'settings', 'raisehand', 'videoquality', 'tileview',
        ],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        BRAND_WATERMARK_LINK: '',
        DEFAULT_BACKGROUND: '#1a1a2e',
        DISABLE_VIDEO_BACKGROUND: false,
      },
    }

    try {
      jitsiApi.current = new window.JitsiMeetExternalAPI('meet.jit.si', options)

      jitsiApi.current.addEventListener('videoConferenceJoined', () => {
        setStatus('ready')
      })

      jitsiApi.current.addEventListener('videoConferenceLeft', () => {
        setStatus('ended')
      })

      jitsiApi.current.addEventListener('participantJoined', () => {
        setParticipantCount((p) => p + 1)
      })

      jitsiApi.current.addEventListener('participantLeft', () => {
        setParticipantCount((p) => Math.max(0, p - 1))
      })

      jitsiApi.current.addEventListener('audioMuteStatusChanged', ({ muted }) => {
        setIsMuted(muted)
      })

      jitsiApi.current.addEventListener('videoMuteStatusChanged', ({ muted }) => {
        setIsVideoOff(muted)
      })
    } catch (err) {
      setStatus('error')
    }
  }

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleLeave = () => {
    if (jitsiApi.current) {
      jitsiApi.current.executeCommand('hangup')
    }
    setStatus('ended')
  }

  const goBack = () => {
    if (user?.role === 'doctor') {
      navigate('/doctor/appointments')
    } else {
      navigate('/appointments')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">

      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">MedConnect — Video Consultation</p>
            <p className="text-gray-400 text-xs">
              {user?.role === 'patient' ? `With Dr. ${doctorName}` : 'Patient Consultation'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {status === 'ready' && (
            <>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-medium">{formatDuration(duration)}</span>
              </div>
              {participantCount > 0 && (
                <span className="text-gray-400 text-xs">👥 {participantCount + 1} participants</span>
              )}
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${isMuted ? 'bg-red-900 text-red-400' : 'bg-gray-700 text-gray-300'}`}>
                  {isMuted ? '🔇 Muted' : '🎙️ On'}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${isVideoOff ? 'bg-red-900 text-red-400' : 'bg-gray-700 text-gray-300'}`}>
                  {isVideoOff ? '📷 Off' : '📹 On'}
                </span>
              </div>
            </>
          )}
          {status === 'connecting' && (
            <span className="text-yellow-400 text-xs animate-pulse">Connecting...</span>
          )}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 relative">

        {/* Connecting State */}
        {status === 'connecting' && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white font-semibold mb-1">Setting up your consultation...</p>
              <p className="text-gray-400 text-sm">Please allow camera and microphone access</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="text-white font-semibold mb-2">Could not load video call</p>
              <p className="text-gray-400 text-sm mb-6">Please check your internet connection and try again.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-green-700 transition mr-3"
              >
                Retry
              </button>
              <button
                onClick={goBack}
                className="bg-gray-700 text-gray-300 px-5 py-2.5 rounded-lg text-sm hover:bg-gray-600 transition"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* Ended State */}
        {status === 'ended' && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <p className="text-white font-semibold text-xl mb-2">Consultation Ended</p>
              <p className="text-gray-400 text-sm mb-2">
                Duration: <span className="text-green-400 font-medium">{formatDuration(duration)}</span>
              </p>
              <p className="text-gray-400 text-sm mb-8">
                {user?.role === 'patient'
                  ? 'Your consultation has been completed. Check your prescriptions for any medicines prescribed.'
                  : 'You can now write a prescription for this patient.'}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={goBack}
                  className="bg-gray-700 text-gray-300 px-5 py-2.5 rounded-lg text-sm hover:bg-gray-600 transition"
                >
                  Back to Appointments
                </button>
                {user?.role === 'doctor' && (
                  <button
                    onClick={() => navigate('/doctor/prescriptions')}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-green-700 transition"
                  >
                    Write Prescription →
                  </button>
                )}
                {user?.role === 'patient' && (
                  <button
                    onClick={() => navigate('/prescriptions')}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-green-700 transition"
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
          className={`w-full h-full ${status === 'ended' || status === 'error' ? 'hidden' : 'block'}`}
          style={{ minHeight: 'calc(100vh - 57px)' }}
        />
      </div>

      {/* Bottom Bar (only when ready) */}
      {status === 'ready' && (
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center justify-between">
          <p className="text-gray-400 text-xs">
            🔒 End-to-end encrypted · Powered by Jitsi Meet
          </p>
          <button
            onClick={handleLeave}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-lg transition font-medium"
          >
            Leave Call
          </button>
        </div>
      )}
    </div>
  )
}

export default VideoConsultationPage