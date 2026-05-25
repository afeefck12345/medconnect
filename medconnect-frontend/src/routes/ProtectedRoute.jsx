import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useSelector((state) => state.auth)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!user) {
    return loading ? (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f0f4fa', color: '#546e7a' }}>
        Loading MedConnect...
      </div>
    ) : null
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />
    return <Navigate to="/home" replace />
  }

  return children
}

export default ProtectedRoute
