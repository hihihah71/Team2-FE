import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ROUTES } from '../../constants/routes'
import type { ApplicationItem, JobItem } from '../../types/domain'
import { StatusBadge } from '../common/StatusBadge'
import { 
  rejectMyApplication, 
  acceptOffer, 
  refuseOffer,
  acceptInterview,
} from '../../features/applications/applicationsService'
import '../../pages/PageUI.css'

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

  const handleAcceptOffer = async (applicationId: string) => {
    try {
      await acceptOffer(applicationId)
      showToast('success', 'Bạn đã chấp nhận offer thành công!')
      window.location.reload()
    } catch (err) {
      console.error(err)
      showToast('error', 'Không thể chấp nhận offer.')
    }
  }

  const handleRefuseOffer = async (applicationId: string) => {
    if (!window.confirm('Bạn chắc chắn muốn từ chối offer này?')) return
    try {
      await refuseOffer(applicationId)
      showToast('success', 'Đã từ chối offer thành công.')
      window.location.reload()
    } catch (err) {
      console.error(err)
      showToast('error', 'Không thể từ chối offer.')
    }
  }

  const handleAcceptInterview = async (applicationId: string) => {
  try {
    await acceptInterview(applicationId)
    showToast('success', 'Bạn đã chấp nhận phỏng vấn!')
    window.location.reload()
  } catch (err) {
    console.error(err)
    showToast('error', 'Không thể chấp nhận phỏng vấn.')
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
            border: toast.type === 'success' ? '1px solid rgba(34,197,94,0.45)' : '1px solid rgba(239,68,68,0.45)',
            background: toast.type === 'success' ? 'rgba(22,163,74,0.8)' : 'rgba(220,38,38,0.8)',
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
        const detailUrl = jobId ? ROUTES.STUDENT_JOB_DETAIL.replace(':jobId', jobId) : ''
        
        return (
          <Link
            key={app._id}
            to={detailUrl}
            style={{
              display: 'block',
              borderRadius: '10px',
              padding: '12px 14px',
              border: '1px solid rgba(55, 65, 81, 0.35)',
              background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(10px)',
              transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
              textDecoration: 'none',
              color: 'inherit',
              cursor: detailUrl ? 'pointer' : 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.25)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(96, 165, 250, 0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.35)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            onClick={detailUrl ? undefined : (e) => e.preventDefault()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '4px' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>{title}</p>
                <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
                  {jobInfo?.company || 'Công ty không xác định'} • {jobInfo?.location || 'Địa điểm linh hoạt'}
                </p>
              </div>
              <StatusBadge status={app.status || 'pending'} />
            </div>

            {app.status === 'interview' && (
  <div style={{ marginTop: '8px', fontSize: '12px', color: '#93c5fd' }}>
    <p>
      📅 Ngày phỏng vấn:{' '}
      {app.interviewDate
        ? new Date(app.interviewDate).toLocaleString()
        : 'Chưa có'}
    </p>
  </div>
)}

            {app.status === 'offered' && (
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleAcceptOffer(app._id)
                  }}
                  className="page-ui__btn page-ui__btn--success"
                  style={{
                    fontSize: '12px',
                    padding: '7px 12px',
                    backgroundColor: '#22c55e',
                    cursor: 'pointer',
                  }}
                  title="Chấp nhận offer"
                >
                  Chấp nhận Offer
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleRefuseOffer(app._id)
                  }}
                  className="page-ui__btn page-ui__btn--danger"
                  style={{ fontSize: '12px', padding: '7px 12px' }}
                  title="Từ chối offer"
                >
                  Từ chối Offer
                </button>
              </div>
            )}

            {app.status === 'interview' && (
  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        handleAcceptInterview(app._id)
      }}
      className="page-ui__btn page-ui__btn--primary"
      style={{ fontSize: '12px', padding: '7px 12px' }}
    >
      Chấp nhận phỏng vấn
    </button>
  </div>
)}

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!canReject) return
                handleReject(app._id).catch(() => undefined)
              }}
              disabled={!canReject}
              className="page-ui__btn page-ui__btn--danger"
              style={{ marginTop: '10px', fontSize: '12px', padding: '7px 12px' }}
              title={!canReject ? 'Đơn đã ở trạng thái từ chối.' : undefined}
            >
              {rejectButtonText}
            </button>
            
            {app.status === 'rejected' && app.rejectedBy === 'student' && (
              <p style={{ marginTop: '8px', fontSize: '12px', color: '#fca5a5' }}>
                Bạn đã chủ động từ chối công việc này.
              </p>
            )}
          </Link>
        )
      })}
    </div>
  )
}

export default StudentMyApplicationsSection

