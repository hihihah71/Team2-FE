import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../contexts/AuthContext'
import { Footer } from '../components/common/Footer'
import { NotificationBell } from '../components/common/NotificationBell'
import { useScrollToTopOnDrillDown } from '../hooks/useScrollToTopOnDrillDown'
import { Sparkles } from 'lucide-react'
import { AIAssistantDrawer } from '../features/cv-builder/components/AIAssistantDrawer'
import { useCVStore } from '../features/cv-builder/store/cvStore'
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

      {/* Global AI Assistant FAB */}
      <style>{`
        @keyframes ai-pulse {
          0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(139, 92, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
        }
        .ai-fab-global {
          position: fixed; bottom: 30px; right: 30px; z-index: 99999;
          background: linear-gradient(135deg, #8b5cf6, #d946ef);
          color: white; border: none; border-radius: 50px;
          padding: 14px 28px; font-weight: 800; cursor: pointer;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.5), inset 0 1px 1px rgba(255,255,255,0.3);
          animation: ai-pulse 2s infinite;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        .ai-fab-global:hover { transform: scale(1.1) translateY(-5px); filter: brightness(1.15); }
      `}</style>

      <button 
        className="ai-fab-global" 
        onClick={() => useCVStore.getState().setAiDrawer({ isOpen: true })}
      >
        <Sparkles size={18} fill="white" />
        Trợ lý AI Career
      </button>

      <AIAssistantDrawer />
    </div>
  )
}

export default StudentLayout
