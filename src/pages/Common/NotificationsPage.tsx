import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import type { NotificationItem } from '../../types/domain'
import { useNotifications } from '../../hooks/useNotifications'
import { PageHeader } from '../../components/common/PageHeader'
import '../PageUI.css'

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

const NotificationsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { items, loading, markOneRead, markAllRead, unreadCount } = useNotifications()
  const [error, setError] = useState<string | null>(null)

  const backPath = useMemo(() => {
    if (location.pathname.startsWith('/recruiter')) return ROUTES.RECRUITER_DASHBOARD
    return ROUTES.STUDENT_DASHBOARD
  }, [location.pathname])

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
    if (!item.isRead) {
      try { await markOneRead(item._id) } catch { /* ignore */ }
    }
    if (targetPath) navigate(targetPath)
  }

  const handleReadAll = async () => {
    try {
      await markAllRead()
    } catch (err) {
      console.error(err)
      setError('Không thể đánh dấu tất cả thông báo đã đọc.')
    }
  }

  return (
    <div className="page-ui">
      <div className="page-ui__container">
        <PageHeader
          title="Thông báo"
          subtitle="Theo dõi cập nhật trạng thái ứng tuyển và thông tin hệ thống."
          backTo={backPath}
          backLabel="Về trang tổng quan"
        />

        {error && <p className="page-ui__error">{error}</p>}

        <section className="page-ui__card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
            <p className="page-ui__muted" style={{ margin: 0, fontSize: '13px' }}>
              {unreadCount > 0 ? (
                <><span style={{ color: '#818cf8', fontWeight: 700 }}>{unreadCount}</span> thông báo chưa đọc</>
              ) : (
                'Tất cả đã đọc'
              )}
            </p>
            {unreadCount > 0 && (
              <button
                className="page-ui__btn page-ui__btn--secondary"
                style={{ fontSize: '12px', padding: '6px 14px' }}
                onClick={handleReadAll}
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {loading ? (
            <p className="page-ui__muted">Đang tải thông báo...</p>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: '40px', margin: '0 0 8px' }}>🔔</p>
              <p className="page-ui__muted">Hiện chưa có thông báo nào.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {items.map((item) => {
                const link = resolveNotificationPath(item)
                return (
                  <div
                    key={item._id}
                    onClick={() => { handleOpenNotification(item).catch(() => undefined) }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      cursor: link ? 'pointer' : 'default',
                      background: item.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.06)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(51, 65, 85, 0.3)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = item.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.06)' }}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', flexShrink: 0, marginTop: '2px',
                    }}>
                      {item.type === 'application_update' ? '📋' : '🔔'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#e2e8f0', lineHeight: 1.3 }}>
                        {item.title}
                      </p>
                      <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#94a3b8', lineHeight: 1.4 }}>
                        {item.message}
                      </p>
                      <span style={{ fontSize: '12px', color: item.isRead ? '#64748b' : '#818cf8', fontWeight: 500 }}>
                        {timeAgo(item.createdAt)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginTop: '8px' }}>
                      {!item.isRead && (
                        <>
                          <span style={{
                            width: '10px', height: '10px', borderRadius: '50%',
                            background: '#6366f1', flexShrink: 0,
                          }} />
                          <button
                            className="page-ui__btn page-ui__btn--secondary"
                            style={{ fontSize: '11px', padding: '4px 10px' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              markOneRead(item._id).catch(() => undefined)
                            }}
                          >
                            Đã đọc
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default NotificationsPage
