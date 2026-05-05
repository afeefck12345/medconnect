import DashboardLayout from '../../components/DashboardLayout'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { getDoctorAppointments } from '../../features/appointment/appointmentSlice'
import { logout } from '../../features/auth/authSlice'
import API from '../../api/axios'
import InlineNotice from '../../components/InlineNotice'

/* ─── Google Fonts ─── */

/* ─── Spinner ─── */
const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
    <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2.5px solid #e5eaf5', borderTopColor: '#4361ee', animation: 'spin 0.7s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

const statusColors = {
  pending: { background: '#fef3c7', color: '#d97706' },
  confirmed: { background: '#d1fae5', color: '#059669' },
  rejected: { background: '#fee2e2', color: '#dc2626' },
  completed: { background: '#dbeafe', color: '#2563eb' },
}

const paymentColors = {
  paid: { background: '#d1fae5', color: '#059669' },
  unpaid: { background: '#fef3c7', color: '#b45309' },
  refunded: { background: '#f1f5f9', color: '#64748b' },
}

const DoctorAppointmentsPageV2 = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { appointments, loading } = useSelector((state) => state.appointment)
  const { user } = useSelector((state) => state.auth)
  const [filter, setFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState(null)
  const [notice, setNotice] = useState({ type: '', message: '' })
  const [historyModal, setHistoryModal] = useState({ open: false, patientName: '', loading: false, data: null })
  
  useEffect(() => {
    dispatch(getDoctorAppointments())
  }, [dispatch])

  
  const handleStatus = async (id, status) => {
    setNotice({ type: '', message: '' })
    setActionLoading(id)
    try {
      await API.put(`/appointments/${id}/status`, { status })
      await dispatch(getDoctorAppointments())
      setNotice({ type: 'success', message: `Appointment ${status} successfully.` })
    } catch (error) {
      setNotice({ type: 'error', message: error.response?.data?.message || 'Could not update status.' })
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = (appointments || []).filter((appointment) =>
    filter === 'all' ? true : appointment.status === filter
  )

  const openPatientHistory = async (appointment) => {
    setHistoryModal({
      open: true,
      patientName: appointment.patient?.name || 'Patient',
      loading: true,
      data: null,
    })

    try {
      const { data } = await API.get(`/appointments/doctor/patient/${appointment.patient?._id}/history`)
      setHistoryModal((current) => ({ ...current, loading: false, data }))
    } catch (error) {
      setHistoryModal((current) => ({ ...current, loading: false, data: null }))
      setNotice({ type: 'error', message: error.response?.data?.message || 'Could not load patient history.' })
    }
  }

  
  
  
  return (
    <DashboardLayout role="doctor">
      <main style={{ marginLeft: sidebarW, flex: 1, padding: '32px 40px', transition: 'margin-left 0.25s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0d1b3e' }}>Appointments</h1>
          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{filtered.length} total</span>
        </div>
        <InlineNotice
          type={notice.type}
          message={notice.message}
          actions={[
            {
              label: 'Dismiss',
              onClick: () => setNotice({ type: '', message: '' }),
            },
          ]}
        />

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
          {['all', 'pending', 'confirmed', 'completed', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '8px 16px', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap',
                background: filter === tab ? '#10b981' : '#fff',
                color: filter === tab ? '#fff' : '#64748b',
                border: filter === tab ? 'none' : '1.5px solid #e5eaf5',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#94a3b8' }}>Loading...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map((appointment) => (
              <div key={appointment._id} style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.18s' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', color: '#059669' }}>
                      {appointment.patient?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#0d1b3e' }}>{appointment.patient?.name || 'Patient'}</p>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{appointment.patient?.email}</p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                        {new Date(appointment.date).toLocaleDateString()} · {appointment.timeSlot}
                      </p>
                      <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '6px 12px', borderRadius: '999px', background: paymentColors[appointment.paymentStatus]?.background || '#f1f5f9', color: paymentColors[appointment.paymentStatus]?.color || '#64748b' }}>
                          Payment: {appointment.paymentStatus || 'unpaid'}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '6px 12px', borderRadius: '999px', background: '#f1f5f9', color: '#64748b' }}>
                          {appointment.type || 'video'} consultation
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '6px 12px', borderRadius: '999px', background: statusColors[appointment.status]?.background || '#f1f5f9', color: statusColors[appointment.status]?.color || '#64748b', textTransform: 'capitalize' }}>
                      {appointment.status}
                    </span>

                    {appointment.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleStatus(appointment._id, 'confirmed')}
                          disabled={actionLoading === appointment._id || (appointment.type === 'video' && appointment.paymentStatus !== 'paid')}
                          style={{ fontSize: '0.75rem', background: '#10b981', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', opacity: actionLoading === appointment._id || (appointment.type === 'video' && appointment.paymentStatus !== 'paid') ? 0.7 : 1 }}
                        >
                          {actionLoading === appointment._id ? 'Updating...' : appointment.type === 'video' && appointment.paymentStatus !== 'paid' ? 'Await Payment' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleStatus(appointment._id, 'rejected')}
                          disabled={actionLoading === appointment._id}
                          style={{ fontSize: '0.75rem', background: '#fee2e2', color: '#dc2626', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', opacity: actionLoading === appointment._id ? 0.7 : 1 }}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {appointment.status === 'confirmed' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {appointment.type === 'video' && appointment.paymentStatus === 'paid' && (
                          <button
                            onClick={() =>
                              navigate(
                                `/consultation?appointmentId=${appointment._id}&doctorName=${encodeURIComponent('You')}&patientName=${encodeURIComponent(appointment.patient?.name || 'Patient')}`
                              )
                            }
                            style={{ fontSize: '0.75rem', background: '#10b981', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                          >
                            Join Call
                          </button>
                        )}
                        <button
                          onClick={() => handleStatus(appointment._id, 'completed')}
                          disabled={actionLoading === appointment._id}
                          style={{ fontSize: '0.75rem', background: '#dbeafe', color: '#2563eb', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', opacity: actionLoading === appointment._id ? 0.7 : 1 }}
                        >
                          {actionLoading === appointment._id ? 'Working...' : 'Mark Completed'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {appointment.symptoms && (
                  <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border-l-2 border-green-400 italic">
                    "{appointment.symptoms}"
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => openPatientHistory(appointment)}
                    className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-100 transition"
                  >
                    View Patient History
                  </button>
                  {appointment.type === 'video' && (
                    <button
                      onClick={() => navigate('/doctor/video-settings')}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition"
                    >
                      Open Video Setup
                    </button>
                  )}
                  {appointment.type === 'video' && appointment.paymentStatus !== 'paid' && (
                    <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                      Waiting for patient payment before confirmation
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {historyModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-800 text-lg">{historyModal.patientName} History</h2>
              <button onClick={() => setHistoryModal({ open: false, patientName: '', loading: false, data: null })} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>

            {historyModal.loading ? (
              <div className="text-sm text-gray-400 py-8 text-center">Loading history...</div>
            ) : !historyModal.data ? (
              <div className="text-sm text-gray-400 py-8 text-center">No history available.</div>
            ) : (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Appointments</p>
                  <div className="space-y-2">
                    {historyModal.data.appointments?.length ? historyModal.data.appointments.map((item) => (
                      <div key={item._id} className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 flex items-center justify-between">
                        <span>{new Date(item.date).toLocaleDateString()} · {item.timeSlot}</span>
                        <span className="text-xs capitalize text-gray-500">{item.status}</span>
                      </div>
                    )) : <p className="text-sm text-gray-400">No past appointments.</p>}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Prescriptions</p>
                  <div className="space-y-2">
                    {historyModal.data.prescriptions?.length ? historyModal.data.prescriptions.map((item) => (
                      <div key={item._id} className="bg-emerald-50 rounded-lg px-3 py-2 text-sm text-gray-700">
                        <p className="font-medium">{item.diagnosis}</p>
                        <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()} · {item.medicines?.length || 0} medicines</p>
                      </div>
                    )) : <p className="text-sm text-gray-400">No prescriptions yet.</p>}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Reviews</p>
                  <div className="space-y-2">
                    {historyModal.data.reviews?.length ? historyModal.data.reviews.map((item) => (
                      <div key={item._id} className="bg-amber-50 rounded-lg px-3 py-2 text-sm text-gray-700">
                        <p className="font-medium">Rating: {item.rating}/5</p>
                        <p className="text-xs text-gray-500">{item.comment || 'No comment provided'}</p>
                      </div>
                    )) : <p className="text-sm text-gray-400">No reviews yet.</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorAppointmentsPageV2
