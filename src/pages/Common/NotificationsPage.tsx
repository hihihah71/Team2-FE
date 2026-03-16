import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import type { NotificationItem } from '../../types/domain'
import { useNotifications } from '../../hooks/useNotifications'
import '../PageUI.css'

const NotificationsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { items, loading, markOneRead, markAllRead, unreadCount } = useNotifications()
  const [localItems, setLocalItems] = useState<NotificationItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const backPath = useMemo(() => {
    if (location.pathname.startsWith('/recruiter')) return ROUTES.RECRUITER_DASHBOARD
    return ROUTES.STUDENT_DASHBOARD
  }, [location.pathname])

  const handleReadOne = async (notificationId: string) => {
    try {
      await markOneRead(notificationId)
      setLocalItems((prev) =>
        (prev || items).map((item) =>
          item._id === notificationId ? { ...item, isRead: true } : item,
        ),
      )
    } catch (err) {
      console.error(err)
      setError('Không thể cập nhật trạng thái thông báo.')
    }
  }

  const handleReadAll = async () => {
    try {
      await markAllRead()
      setLocalItems((prev) => (prev || items).map((item) => ({ ...item, isRead: true })))
    } catch (err) {
      console.error(err)
      setError('Không thể đánh dấu tất cả thông báo đã đọc.')
    }
  }

  const displayedItems = localItems || items
  const isRecruiterPage = location.pathname.startsWith('/recruiter')

  const resolveNotificationPath = (item: NotificationItem) => {
    if (item.entityType === 'job' && item.entityId) {
      if (isRecruiterPage) {
        return ROUTES.RECRUITER_JOB_DETAIL.replace(':jobId', item.entityId)
      }
      return ROUTES.STUDENT_JOB_DETAIL.replace(':jobId', item.entityId)
    }
    return null
  }

  const handleOpenNotification = async (item: NotificationItem) => {
    const targetPath = resolveNotificationPath(item)
    if (!targetPath) return
    if (!item.isRead) {
      await handleReadOne(item._id)
    }
    navigate(targetPath)
  }

  return (
    <div className="page-ui">
      <div className="page-ui__container">
        <Link to={backPath} className="page-ui__back-link">
          ← Về trang tổng quan
        </Link>
        <header className="page-ui__header">
          <h1 className="page-ui__title">Thông báo</h1>
          <p className="page-ui__subtitle">
            Theo dõi cập nhật trạng thái ứng tuyển và thông tin hệ thống.
          </p>
        </header>

        {error && <p className="page-ui__error">{error}</p>}

        <section className="page-ui__card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              gap: '12px',
            }}
          >
            <p className="page-ui__muted" style={{ margin: 0 }}>
              {unreadCount} thông báo chưa đọc
            </p>
            <button className="page-ui__btn page-ui__btn--primary" onClick={handleReadAll}>
              Đánh dấu tất cả đã đọc
            </button>
          </div>

          {loading ? (
            <p className="page-ui__muted">Đang tải thông báo...</p>
          ) : displayedItems.length === 0 ? (
            <p className="page-ui__muted">Hiện chưa có thông báo nào.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {displayedItems.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    handleOpenNotification(item).catch(() => undefined)
                  }}
                  style={{
                    borderRadius: '10px',
                    border: '1px solid rgba(51,65,85,0.9)',
                    backgroundColor: item.isRead ? '#0b1220' : '#111827',
                    padding: '12px',
                    cursor: resolveNotificationPath(item) ? 'pointer' : 'default',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '12px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '14px' }}>{item.title}</p>
                      <p style={{ margin: '6px 0 0', color: '#cbd5e1', fontSize: '13px' }}>
                        {item.message}
                      </p>
                      <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '12px' }}>
                        {new Date(item.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    {!item.isRead && (
                      <button
                        className="page-ui__btn page-ui__btn--success"
                        style={{ padding: '7px 10px' }}
                        onClick={(event) => {
                          event.stopPropagation()
                          handleReadOne(item._id).catch(() => undefined)
                        }}
                      >
                        Đã đọc
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default NotificationsPage
