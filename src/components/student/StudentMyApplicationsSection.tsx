import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ROUTES } from '../../constants/routes'
import type { ApplicationItem, JobItem } from '../../types/domain'
import { StatusBadge } from '../common/StatusBadge'
import { rejectMyApplication } from '../../features/applications/applicationsService'

type Props = {
  applications: ApplicationItem[]
  loading: boolean
}

const StudentMyApplicationsSection = ({ applications, loading }: Props) => {
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    window.setTimeout(() => setToast(null), 2400)
  }

  const handleReject = async (applicationId: string) => {
    if (!window.confirm('Bạn chắc chắn muốn từ chối đơn ứng tuyển này?')) return
    try {
      await rejectMyApplication(applicationId)
      showToast('success', 'Đã từ chối công việc thành công.')
      window.location.reload()
    } catch (err) {
      console.error(err)
      showToast('error', 'Không thể từ chối đơn ứng tuyển.')
    }
  }

  if (loading) {
    return <p style={{ color: '#9ca3af', fontSize: '14px' }}>Đang tải danh sách đơn đã ứng tuyển...</p>
  }

  if (!applications.length) {
    return (
      <p style={{ color: '#9ca3af', fontSize: '14px' }}>
        Bạn chưa ứng tuyển công việc nào. Hãy bắt đầu từ trang Tìm việc.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {toast && (
        <div
          style={{
            borderRadius: '10px',
            padding: '10px 12px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#f8fafc',
            border:
              toast.type === 'success'
                ? '1px solid rgba(34,197,94,0.45)'
                : '1px solid rgba(239,68,68,0.45)',
            background:
              toast.type === 'success'
                ? 'rgba(22,163,74,0.8)'
                : 'rgba(220,38,38,0.8)',
          }}
        >
          {toast.message}
        </div>
      )}
      {applications.map((app) => {
        const jobInfo = app.jobId as JobItem | undefined
        const jobId = typeof app.jobId === 'string' ? app.jobId : jobInfo?._id
        const title = jobInfo?.title || 'Vị trí không xác định'
        const canReject = app.status !== 'rejected'
        const rejectButtonText =
          app.status === 'rejected'
            ? 'Đơn đã từ chối'
            : app.status === 'offered'
              ? 'Từ chối offer'
              : 'Từ chối công việc này'
        return (
        <div
          key={app._id}
          style={{
            borderRadius: '10px',
            padding: '12px 14px',
            border: '1px solid rgba(55,65,81,1)',
            backgroundColor: '#020617',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '4px',
            }}
          >
            <div>
              {jobId ? (
                <Link
                  to={ROUTES.STUDENT_JOB_DETAIL.replace(':jobId', jobId)}
                  style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', textDecoration: 'none' }}
                >
                  {title}
                </Link>
              ) : (
                <p style={{ fontSize: '14px', fontWeight: 600 }}>{title}</p>
              )}
              <p style={{ fontSize: '13px', color: '#9ca3af' }}>
                {jobInfo?.company || 'Công ty không xác định'} •{' '}
                {jobInfo?.location || 'Địa điểm linh hoạt'}
              </p>
            </div>
            <StatusBadge status={app.status || 'pending'} />
          </div>
          {app.createdAt && (
            <p style={{ fontSize: '12px', color: '#6b7280' }}>
              Nộp ngày {new Date(app.createdAt).toLocaleDateString('vi-VN')}
            </p>
          )}
          {app.statusHistory && app.statusHistory.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontSize: '12px', color: '#93c5fd', marginBottom: '6px' }}>
                Lịch sử trạng thái
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {app.statusHistory.map((item, idx) => (
                  <div
                    key={`${app._id}-${item.status}-${idx}`}
                    title={
                      item.updatedAt
                        ? new Date(item.updatedAt).toLocaleString('vi-VN')
                        : 'Không rõ thời gian'
                    }
                  >
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              if (!canReject) return
              handleReject(app._id).catch(() => undefined)
            }}
            disabled={!canReject}
            style={{
              marginTop: '10px',
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(239,68,68,0.45)',
              background: canReject ? 'rgba(239,68,68,0.15)' : 'rgba(71,85,105,0.25)',
              color: canReject ? '#fda4af' : '#94a3b8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: canReject ? 'pointer' : 'not-allowed',
              opacity: canReject ? 1 : 0.8,
            }}
            title={!canReject ? 'Đơn đã ở trạng thái từ chối.' : undefined}
          >
            {rejectButtonText}
          </button>
          {app.status === 'rejected' && app.rejectedBy === 'student' && (
            <p style={{ marginTop: '8px', fontSize: '12px', color: '#fca5a5' }}>
              Bạn đã chủ động từ chối công việc này.
            </p>
          )}
        </div>
        )
      })}
    </div>
  )
}

export default StudentMyApplicationsSection

