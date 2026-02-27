import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

type TopNavbarProps = {
  onOpenLogin?: () => void
  onOpenRegister?: () => void
}

const TopNavbar = ({ onOpenLogin, onOpenRegister }: TopNavbarProps) => {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 0',
        borderBottom: '1px solid rgba(31,41,55,1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '999px',
            background:
              'conic-gradient(from 180deg, #4f46e5, #22c55e, #0ea5e9, #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 700,
            color: '#0b1120',
          }}
        >
          CV
        </div>
        <div>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 600,
              letterSpacing: 0.2,
            }}
          >
            CV Matching Platform
          </span>
          <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>
            Student & Recruiter Portal
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onOpenLogin ? (
          <button
            type="button"
            onClick={onOpenLogin}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              borderRadius: '999px',
              border: '1px solid rgba(75,85,99,1)',
              color: '#e5e7eb',
              background: 'transparent',
            }}
          >
            Đăng nhập
          </button>
        ) : (
          <Link
            to={ROUTES.LOGIN}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              borderRadius: '999px',
              border: '1px solid rgba(75,85,99,1)',
              color: '#e5e7eb',
            }}
          >
            Đăng nhập
          </Link>
        )}
        {onOpenRegister ? (
          <button
            type="button"
            onClick={onOpenRegister}
            style={{
              padding: '7px 16px',
              fontSize: '13px',
              borderRadius: '999px',
              background:
                'linear-gradient(135deg, rgba(59,130,246,1), rgba(129,140,248,1))',
              color: '#f9fafb',
              fontWeight: 600,
              border: 'none',
            }}
          >
            Đăng ký
          </button>
        ) : (
          <Link
            to={ROUTES.REGISTER}
            style={{
              padding: '7px 16px',
              fontSize: '13px',
              borderRadius: '999px',
              background:
                'linear-gradient(135deg, rgba(59,130,246,1), rgba(129,140,248,1))',
              color: '#f9fafb',
              fontWeight: 600,
            }}
          >
            Đăng ký
          </Link>
        )}
      </div>
    </nav>
  )
}

export default TopNavbar

