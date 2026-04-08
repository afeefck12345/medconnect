import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux' // Added these
import { getUserProfile } from './features/auth/authSlice' // Added this
import ProtectedRoute from './routes/ProtectedRoute'

// Page Imports (Keep your existing imports here...)
import VideoConsultationPage from './pages/VideoConsultationPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import HomePage from './pages/patient/HomePage'
import DoctorsPage from './pages/patient/DoctorsPage'
import DoctorDetailPage from './pages/patient/DoctorDetailPage'
import AppointmentsPage from './pages/patient/AppointmentsPage'
import PatientProfilePage from './pages/patient/PatientProfilePage'
import PrescriptionsPage from './pages/patient/PrescriptionsPage'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorSchedulePage from './pages/doctor/DoctorSchedulePage'
import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage'
import DoctorPrescriptionsPage from './pages/doctor/DoctorPrescriptionsPage'
import DoctorProfilePage from './pages/doctor/DoctorProfilePage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminDoctorsPage from './pages/admin/AdminDoctorsPage'
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage'

function App() {
  const dispatch = useDispatch()
  const { user, loading, token } = useSelector((state) => state.auth)

  useEffect(() => {
    // If we have a token but no user data, fetch the profile (Persistence fix)
    if (token && !user) {
      dispatch(getUserProfile())
    }
  }, [dispatch, token, user])

  // Simple loading screen to prevent flickering on refresh
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Patient Routes */}
        <Route path="/home" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/doctors" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <DoctorsPage />
          </ProtectedRoute>
        } />
        <Route path="/doctors/:id" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <DoctorDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <AppointmentsPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/prescriptions" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PrescriptionsPage />
          </ProtectedRoute>
        } />

        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor/schedule" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorSchedulePage />
          </ProtectedRoute>
        } />
        <Route path="/doctor/appointments" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorAppointmentsPage />
          </ProtectedRoute>
        } />
        <Route path="/doctor/prescriptions" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorPrescriptionsPage />
          </ProtectedRoute>
        } />
        <Route path="/doctor/profile" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorProfilePage />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsersPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/doctors" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDoctorsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/appointments" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAppointmentsPage />
          </ProtectedRoute>
        } />

        {/* Shared Routes */}
        <Route path="/consultation" element={
          <ProtectedRoute allowedRoles={['patient', 'doctor']}>
            <VideoConsultationPage />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App