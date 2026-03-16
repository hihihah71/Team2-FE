import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../contexts/AuthContext'
import { Footer } from '../components/common/Footer'
import { NotificationBell } from '../components/common/NotificationBell'
import { useScrollToTopOnDrillDown } from '../hooks/useScrollToTopOnDrillDown'
import type { NotificationItem } from '../types/domain'

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
  useScrollToTopOnDrillDown()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'transparent',
        color: '#e5e7eb',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <nav
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid rgba(55,65,81,0.6)',
          background: 'rgba(2, 6, 23, 0.6)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          position: 'sticky',
          top: 0,
          zIndex: 40,
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
        {navItems.map(({ to, label }) => {
          const active = location.pathname === to || (to !== ROUTES.STUDENT_DASHBOARD && location.pathname.startsWith(to))
          return (
          <Link
            key={to}
            to={to}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              color: active ? '#fff' : '#9ca3af',
              backgroundColor: active ? 'rgba(59,130,246,0.2)' : 'transparent',
              textDecoration: 'none',
              transition: 'color 0.25s ease, background-color 0.25s ease',
            }}
          >
            {label}
          </Link>
          )
        })}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <NotificationBell
            allNotificationsPath={ROUTES.STUDENT_NOTIFICATIONS}
            resolveLink={(item: NotificationItem) => {
              if (item.entityType === 'job' && item.entityId) {
                return ROUTES.STUDENT_JOB_DETAIL.replace(':jobId', item.entityId)
              }
              return null
            }}
          />
        {user && (
          <button
            type="button"
            onClick={() => {
              logout()
              navigate(ROUTES.HOME, { replace: true })
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#9ca3af',
              background: 'transparent',
              border: '1px solid rgba(75,85,99,1)',
              cursor: 'pointer',
              transition: 'color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#e2e8f0'
              e.currentTarget.style.borderColor = 'rgba(148,163,184,0.6)'
              e.currentTarget.style.backgroundColor = 'rgba(51,65,85,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9ca3af'
              e.currentTarget.style.borderColor = 'rgba(75,85,99,1)'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Đăng xuất
          </button>
        )}
        </div>
      </nav>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default StudentLayout
