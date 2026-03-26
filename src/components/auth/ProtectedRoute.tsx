import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ROUTES } from '../../constants/routes'

type ProtectedRouteProps = {
  children: ReactNode
  role: 'student' | 'recruiter' | 'admin'
}

/**
 * Bảo vệ route: phải đăng nhập và đúng role. Nếu gõ trực tiếp link mà chưa login hoặc sai role → redirect.
 */
export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#020617',
          color: '#9ca3af',
        }}
      >
        Đang xác thực...
      </div>
    )
  }

  if (!user) {
    return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />
  }

  if (user.role !== role) {
    // If user is a student trying to access recruiter, send to student dashboard.
    // Otherwise (recruiter trying to access student, or unknown role), send to recruiter or home.
    if (user.role === 'student') return <Navigate to={ROUTES.STUDENT_DASHBOARD} replace />
    if (user.role === 'recruiter') return <Navigate to={ROUTES.RECRUITER_DASHBOARD} replace />
    if (user.role === 'admin') return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <>{children}</>
}
