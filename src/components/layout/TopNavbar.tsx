import { Link } from 'react-router-dom'

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
        padding: '20px 0',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'rgba(2, 6, 23, 0.5)',
        backdropFilter: 'blur(12px)',
        margin: '0 -20px',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 800,
            color: '#fff',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
          }}
        >
          C
        </div>
        <div>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: -0.5,
              color: '#f8fafc',
              display: 'block',
              lineHeight: 1,
            }}
          >
            CV Matching
          </span>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
            Smart Career Portal
          </span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {onOpenLogin && (
          <button
            type="button"
            onClick={onOpenLogin}
            className="page-ui__button page-ui__button--secondary"
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              border: 'none',
              background: 'transparent',
              color: '#94a3b8',
            }}
          >
            Đăng nhập
          </button>
        )}
        {onOpenRegister && (
          <button
            type="button"
            onClick={onOpenRegister}
            className="page-ui__button page-ui__button--primary"
            style={{
              padding: '8px 24px',
              fontSize: '14px',
            }}
          >
            Đăng ký
          </button>
        )}
      </div>
    </nav>
  )
}

export default TopNavbar


