import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMyAppointments } from '../../features/appointment/appointmentSlice'
import { logout } from '../../features/auth/authSlice'
import API from '../../api/axios'

const DoctorPrescriptionsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { appointments } = useSelector((state) => state.appointment)

  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    appointmentId: '',
    patientName: '',
    diagnosis: '',
    medicines: [{ name: '', dosage: '', duration: '' }],
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

  const confirmedAppointments = appointments.filter((a) => a.status === 'confirmed' || a.status === 'completed')

  const addMedicine = () => {
    setForm((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', duration: '' }],
    }))
  }

  const removeMedicine = (index) => {
    setForm((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }))
  }

  const updateMedicine = (index, field, value) => {
    setForm((prev) => {
      const meds = [...prev.medicines]
      meds[index] = { ...meds[index], [field]: value }
      return { ...prev, medicines: meds }
    })
  }

  const handleAppointmentSelect = (id) => {
    const apt = confirmedAppointments.find((a) => a._id === id)
    setForm((prev) => ({
      ...prev,
      appointmentId: id,
      patientName: apt?.patient?.name || '',
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await API.post('/prescriptions', form)
      setShowForm(false)
      setForm({ appointmentId: '', patientName: '', diagnosis: '', medicines: [{ name: '', dosage: '', duration: '' }], notes: '' })
      fetchPrescriptions()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const navLinks = [
    { label: 'Dashboard', path: '/doctor/dashboard' },
    { label: 'Appointments', path: '/doctor/appointments' },
    { label: 'Schedule', path: '/doctor/schedule' },
    { label: 'Prescriptions', path: '/doctor/prescriptions' },
    { label: 'Profile', path: '/doctor/profile' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg">MedConnect</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium ml-1">Doctor</span>
          </div>
          <div className="flex items-center gap-4">
            {navLinks.map((link) => (
              <button key={link.path} onClick={() => navigate(link.path)} className="text-sm text-gray-600 hover:text-green-600 transition">{link.label}</button>
            ))}
            <button onClick={handleLogout} className="text-sm bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + New Prescription
          </button>
        </div>

        {/* New Prescription Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 overflow-y-auto py-8">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl my-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-800 text-lg">Write Prescription</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Select Appointment</label>
                  <select
                    value={form.appointmentId}
                    onChange={(e) => handleAppointmentSelect(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">-- Select appointment --</option>
                    {confirmedAppointments.map((apt) => (
                      <option key={apt._id} value={apt._id}>
                        {apt.patient?.name} — {new Date(apt.date).toLocaleDateString()} {apt.timeSlot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Diagnosis</label>
                  <input
                    type="text"
                    value={form.diagnosis}
                    onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                    placeholder="e.g. Viral fever, Hypertension..."
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Medicines</label>
                    <button type="button" onClick={addMedicine} className="text-xs text-green-600 hover:underline">+ Add Medicine</button>
                  </div>
                  <div className="space-y-2">
                    {form.medicines.map((med, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Medicine name"
                            value={med.name}
                            onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                            className="col-span-3 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <input
                            type="text"
                            placeholder="Dosage"
                            value={med.dosage}
                            onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <input
                            type="text"
                            placeholder="Frequency"
                            value={med.frequency}
                            onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <input
                            type="text"
                            placeholder="Duration"
                            value={med.duration}
                            onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        {form.medicines.length > 1 && (
                          <button type="button" onClick={() => removeMedicine(index)} className="text-red-400 hover:text-red-600 text-lg mt-1">×</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Additional Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Rest advice, diet, follow-up..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2.5 rounded-lg text-sm font-medium transition"
                >
                  {submitting ? 'Saving...' : 'Save Prescription'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Prescriptions List */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading prescriptions...</div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="mb-4">No prescriptions written yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-green-700 transition"
            >
              Write your first prescription
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((rx) => (
              <div key={rx._id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                      {rx.patient?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{rx.patient?.name || 'Patient'}</p>
                      <p className="text-xs text-gray-400">
                        📅 {new Date(rx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                    {rx.diagnosis}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-600 mb-2">💊 Medicines</p>
                  <div className="space-y-1">
                    {rx.medicines?.map((med, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span className="font-medium">{med.name}</span>
                        {med.dosage && <span className="text-gray-400">· {med.dosage}</span>}
                        {med.duration && <span className="text-gray-400">· {med.duration}</span>}
                      </div>
                    ))}
                  </div>
                  {rx.notes && (
                    <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">📝 {rx.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorPrescriptionsPage