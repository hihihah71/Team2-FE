import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useNotifications } from '../../hooks/useNotifications'
import type { NotificationItem } from '../../types/domain'
import './NotificationBell.css'

type NotificationBellProps = {
  allNotificationsPath: string
  resolveLink?: (item: NotificationItem) => string | null
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'Vừa xong'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} phút trước`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} ngày trước`
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

export const NotificationBell = ({
  allNotificationsPath,
  resolveLink,
}: NotificationBellProps) => {
  const { items, unreadCount, markOneRead, markAllRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const open = useCallback(() => {
    setIsOpen(true)
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const close = useCallback(() => {
    setVisible(false)
    const timeout = window.setTimeout(() => setIsOpen(false), 200)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, close])

  const handleItemClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      try { await markOneRead(item._id) } catch { /* ignore */ }
    }
    const link = resolveLink?.(item)
    if (link) {
      close()
      navigate(link)
    }
  }

  const handleMarkAllRead = async () => {
    try { await markAllRead() } catch { /* ignore */ }
  }

  const recent = items.slice(0, 8)

  return (
    <div className="notif-bell" ref={containerRef}>
      <button
        type="button"
        className="notif-bell__trigger"
        onClick={() => (isOpen ? close() : open())}
        aria-label="Thông báo"
      >
        <svg
          className="notif-bell__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="notif-bell__badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`notif-bell__dropdown ${visible ? 'notif-bell__dropdown--visible' : ''}`}>
          <div className="notif-bell__header">
            <h3 className="notif-bell__title">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                className="notif-bell__mark-all"
                onClick={handleMarkAllRead}
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          <div className="notif-bell__list">
            {recent.length === 0 ? (
              <p className="notif-bell__empty">Chưa có thông báo nào.</p>
            ) : (
              recent.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  className={`notif-bell__item ${!item.isRead ? 'notif-bell__item--unread' : ''}`}
                  onClick={() => { handleItemClick(item).catch(() => undefined) }}
                >
                  <div className="notif-bell__item-icon">
                    {item.type === 'application_update' ? '📋' : '🔔'}
                  </div>
                  <div className="notif-bell__item-body">
                    <p className="notif-bell__item-title">{item.title}</p>
                    <p className="notif-bell__item-msg">{item.message}</p>
                    <span className="notif-bell__item-time">{timeAgo(item.createdAt)}</span>
                  </div>
                  {!item.isRead && <span className="notif-bell__dot" />}
                </button>
              ))
            )}
          </div>

          <Link
            to={allNotificationsPath}
            className="notif-bell__see-all"
            onClick={() => close()}
          >
            Xem tất cả thông báo
          </Link>
        </div>
      )}
    </div>
  )
}
