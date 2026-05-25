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
import MyReviewsPage from './pages/patient/MyReviewsPage'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorSchedulePage from './pages/doctor/DoctorSchedulePage'
import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage'
import DoctorPrescriptionsPage from './pages/doctor/DoctorPrescriptionsPage'
import DoctorProfilePage from './pages/doctor/DoctorProfilePage'
import DoctorVideoSettingsPage from './pages/doctor/DoctorVideoSettingsPage'
import NotificationsPage from './pages/NotificationsPage'
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0f4fa', gap: 16 }}>
        <div style={{ width: 48, height: 48, border: '4px solid #e3f2fd', borderTop: '4px solid #1565c0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: '#90a4ae', fontSize: 14, fontWeight: 500, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}>Loading MedConnect...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
        <Route path="/reviews" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <MyReviewsPage />
          </ProtectedRoute>
        } />
        <Route path="/my-reviews" element={<Navigate to="/reviews" replace />} />

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
        <Route path="/doctor/video-settings" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorVideoSettingsPage />
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
        <Route path="/notifications" element={
          <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
            <NotificationsPage />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
