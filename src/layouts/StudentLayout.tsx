import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: ROUTES.STUDENT_DASHBOARD, label: 'Tổng quan' },
  { to: ROUTES.STUDENT_JOBS, label: 'Tìm việc' },
  { to: ROUTES.STUDENT_MY_JOBS, label: 'Đơn đã apply & đã lưu' },
  { to: ROUTES.STUDENT_CV, label: 'Quản lý CV' },
  { to: ROUTES.STUDENT_PROFILE, label: 'Cá nhân' },
]

const StudentLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#020617',
        color: '#e5e7eb',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <nav
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid rgba(55,65,81,1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Link
          to={ROUTES.HOME}
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#e5e7eb',
            textDecoration: 'none',
            marginRight: '16px',
          }}
        >
          CV Platform
        </Link>
        {navItems.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              color: location.pathname === to || (to !== ROUTES.STUDENT_DASHBOARD && location.pathname.startsWith(to)) ? '#fff' : '#9ca3af',
              backgroundColor: location.pathname === to || (to !== ROUTES.STUDENT_DASHBOARD && location.pathname.startsWith(to)) ? 'rgba(59,130,246,0.2)' : 'transparent',
              textDecoration: 'none',
            }}
          >
            {label}
          </Link>
        ))}
        {user && (
          <button
            type="button"
            onClick={() => {
              logout()
              navigate(ROUTES.HOME, { replace: true })
            }}
            style={{
              marginLeft: 'auto',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#9ca3af',
              background: 'transparent',
              border: '1px solid rgba(75,85,99,1)',
              cursor: 'pointer',
            }}
          >
            Đăng xuất
          </button>
        )}
      </nav>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}

export default StudentLayout
