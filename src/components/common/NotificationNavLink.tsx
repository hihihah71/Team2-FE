import { Link } from 'react-router-dom'
import { useNotifications } from '../../hooks/useNotifications'

type NotificationNavLinkProps = {
  to: string
  active: boolean
  activeBackground: string
}

export const NotificationNavLink = ({
  to,
  active,
  activeBackground,
}: NotificationNavLinkProps) => {
  const { unreadCount } = useNotifications()

  return (
    <Link
      to={to}
      style={{
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '13px',
        color: active ? '#fff' : '#9ca3af',
        backgroundColor: active ? activeBackground : 'transparent',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <span>Thông báo</span>
      {unreadCount > 0 && (
        <span
          style={{
            minWidth: '18px',
            height: '18px',
            borderRadius: '999px',
            fontSize: '11px',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ef4444',
            color: '#fff',
            padding: '0 5px',
          }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  )
}
