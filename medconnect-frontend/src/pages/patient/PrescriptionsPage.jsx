import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/authSlice'
import { useDispatch } from 'react-redux'
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
            body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #16a34a; padding-bottom: 16px; margin-bottom: 24px; }
            .brand { font-size: 22px; font-weight: bold; color: #16a34a; }
            .brand-sub { font-size: 12px; color: #666; }
            .rx-symbol { font-size: 40px; color: #16a34a; font-style: italic; font-weight: bold; }
            .section { margin-bottom: 20px; }
            .label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
            .value { font-size: 14px; color: #111; font-weight: 500; }
            .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
            .medicine-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .medicine-table th { background: #f0fdf4; text-align: left; padding: 10px 12px; font-size: 12px; color: #16a34a; border-bottom: 1px solid #d1fae5; }
            .medicine-table td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #f3f4f6; }
            .medicine-table tr:last-child td { border-bottom: none; }
            .notes-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; margin-bottom: 24px; font-size: 13px; color: #374151; }
            .footer { border-top: 1px solid #e5e7eb; padding-top: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
            .signature-line { border-top: 1px solid #111; width: 180px; margin-top: 40px; padding-top: 6px; font-size: 12px; color: #666; text-align: center; }
            .diagnosis-badge { display: inline-block; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => {
      win.print()
      win.close()
    }, 500)
  }

  const navLinks = [
    { label: 'Home', path: '/home' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'Appointments', path: '/appointments' },
    { label: 'Prescriptions', path: '/prescriptions' },
    { label: 'Profile', path: '/profile' },
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
          </div>
          <div className="flex items-center gap-4">
            {navLinks.map((link) => (
              <button key={link.path} onClick={() => navigate(link.path)} className="text-sm text-gray-600 hover:text-green-600 transition">{link.label}</button>
            ))}
            <button onClick={handleLogout} className="text-sm bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Prescriptions</h1>

        {/* Prescription Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 px-4 py-8 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-auto">

              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Prescription Details</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download / Print
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Printable Content */}
              <div ref={printRef} className="p-6">

                {/* Prescription Header */}
                <div className="flex items-start justify-between border-b-2 border-green-500 pb-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <span className="font-bold text-green-700 text-lg">MedConnect</span>
                    </div>
                    <p className="text-xs text-gray-400">Digital Medical Prescription</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-green-600 italic">℞</p>
                    <p className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                {/* Doctor & Patient Info */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Doctor</p>
                    <p className="font-semibold text-gray-800 text-sm">Dr. {selected.doctor?.name || 'Doctor'}</p>
                    <p className="text-xs text-gray-400">{selected.doctor?.specialization}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Patient</p>
                    <p className="font-semibold text-gray-800 text-sm">{selected.patient?.name || user?.name}</p>
                    <p className="text-xs text-gray-400">{selected.patient?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Diagnosis</p>
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                      {selected.diagnosis}
                    </span>
                  </div>
                </div>

                {/* Medicines Table */}
                <div className="mb-6">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Prescribed Medicines</p>
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-green-50">
                          <th className="text-left text-xs font-medium text-green-700 px-4 py-3">#</th>
                          <th className="text-left text-xs font-medium text-green-700 px-4 py-3">Medicine</th>
                          <th className="text-left text-xs font-medium text-green-700 px-4 py-3">Dosage</th>
                          <th className="text-left text-xs font-medium text-green-700 px-4 py-3">Frequency</th>
                          <th className="text-left text-xs font-medium text-green-700 px-4 py-3">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {selected.medicines?.map((med, i) => (
                          <tr key={i}>
                            <td className="px-4 py-3 text-xs text-gray-400">{i + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-800">{med.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{med.dosage || '—'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{med.frequency || '—'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{med.duration || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Notes */}
                {selected.notes && (
                  <div className="mb-6">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Doctor's Notes</p>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <p className="text-sm text-gray-600">{selected.notes}</p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-end justify-between border-t border-gray-100 pt-4 mt-2">
                  <p className="text-xs text-gray-400">
                    This is a digitally generated prescription from MedConnect.
                  </p>
                  <div className="text-right">
                    <div className="border-t border-gray-800 w-44 mb-1 ml-auto" />
                    <p className="text-xs text-gray-600 font-medium">Dr. {selected.doctor?.name}</p>
                    <p className="text-xs text-gray-400">{selected.doctor?.specialization}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prescriptions List */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading prescriptions...</div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">No prescriptions yet</p>
            <button
              onClick={() => navigate('/appointments')}
              className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-green-700 transition"
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((rx) => (
              <div
                key={rx._id}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-green-200 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelected(rx)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">
                      ℞
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Dr. {rx.doctor?.name || 'Doctor'}</p>
                      <p className="text-xs text-gray-400">{rx.doctor?.specialization}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        📅 {new Date(rx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      {rx.diagnosis}
                    </span>
                    <span className="text-xs text-gray-400">
                      💊 {rx.medicines?.length || 0} medicine{rx.medicines?.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-green-600 hover:underline">View & Download →</span>
                  </div>
                </div>

                {/* Medicine preview */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {rx.medicines?.slice(0, 3).map((med, i) => (
                    <span key={i} className="text-xs bg-gray-50 text-gray-600 border border-gray-100 px-2.5 py-1 rounded-full">
                      {med.name}
                    </span>
                  ))}
                  {rx.medicines?.length > 3 && (
                    <span className="text-xs text-gray-400 px-2 py-1">+{rx.medicines.length - 3} more</span>
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

export default PrescriptionsPage