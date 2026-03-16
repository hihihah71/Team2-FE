import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import { ROUTES } from '../../constants/routes'
import type { JobItem } from '../../types/domain'
import { StatusBadge } from '../common/StatusBadge'

type Props = {
  jobs: JobItem[]
  loading: boolean
  onDelete?: (jobId: string) => void
  onToggleStatus?: (job: JobItem) => void
}

const RecruiterJobList = ({ jobs, loading, onDelete, onToggleStatus }: Props) => {
  const baseButtonStyle: CSSProperties = {
    padding: '8px 14px',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    width: '120px',
    border: '1px solid transparent',
    transition: 'filter 0.15s ease, transform 0.15s ease',
  }

  if (loading) {
    return <p style={{ padding: '20px' }}>Đang tải...</p>
  }

  if (!jobs.length) {
    return (
      <p style={{ padding: '20px', color: '#9ca3af' }}>
        Chưa có bài đăng nào. Hãy tạo tin đầu tiên của bạn.
      </p>
    )
  }

  return (
    <section
      style={{
        borderRadius: '12px',
        border: '1px solid rgba(55,65,81,1)',
        overflow: 'hidden',
      }}
    >
      {jobs.map((job) => (
        <div
          key={job._id}
          style={{
            display: 'flex',
            gap: '20px',
            padding: '20px',
            borderBottom: '1px solid #1e293b',
            alignItems: 'center',
          }}
        >
          {job.imageUrl && (
            <img
              src={job.imageUrl}
              alt=""
              style={{
                width: '120px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>{job.title}</h3>
              <StatusBadge status={job.status || 'draft'} />
            </div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>
              {job.company} • {job.location}
            </div>
            <div
              style={{
                marginTop: '6px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#22c55e',
              }}
            >
              💰{' '}
              {job.salaryMin != null
                ? `${job.salaryMin.toLocaleString('vi-VN')} VND`
                : 'Thoả thuận'}
            </div>
            {job.phone && (
              <div style={{ fontSize: '13px', color: '#64748b' }}>📞 {job.phone}</div>
            )}
            <div style={{ fontSize: '13px', color: '#93c5fd', marginTop: '4px' }}>
              👁️ Lượt xem chi tiết: {(job.detailViewCount ?? 0).toLocaleString('vi-VN')}
            </div>
            {job.description && (
              <p
                style={{
                  marginTop: '8px',
                  color: '#cbd5e1',
                  fontSize: '14px',
                }}
              >
                {job.description.length > 120
                  ? `${job.description.slice(0, 120)}...`
                  : job.description}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link
              to={ROUTES.RECRUITER_JOB_STATS.replace(':jobId', job._id)}
              style={{ textDecoration: 'none' }}
            >
              <button
                style={{
                  ...baseButtonStyle,
                  background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                  boxShadow: '0 10px 18px rgba(37,99,235,0.25)',
                }}
              >
                Thống kê
              </button>
            </Link>
            <Link
              to={ROUTES.RECRUITER_JOB_EDIT.replace(':jobId', job._id)}
              style={{ textDecoration: 'none' }}
            >
              <button
                style={{
                  ...baseButtonStyle,
                  background: 'rgba(59,130,246,0.12)',
                  border: '1px solid rgba(59,130,246,0.45)',
                  color: '#bfdbfe',
                }}
              >
                Chỉnh sửa
              </button>
            </Link>
            <button
              onClick={() => onToggleStatus?.(job)}
              style={{
                ...baseButtonStyle,
                background:
                  job.status === 'open'
                    ? 'rgba(245,158,11,0.14)'
                    : 'rgba(34,197,94,0.14)',
                border:
                  job.status === 'open'
                    ? '1px solid rgba(245,158,11,0.45)'
                    : '1px solid rgba(34,197,94,0.45)',
                color: job.status === 'open' ? '#fcd34d' : '#86efac',
              }}
            >
              {job.status === 'open' ? 'Đóng tin' : 'Mở lại'}
            </button>
            <button
              onClick={() => onDelete?.(job._id)}
              style={{
                ...baseButtonStyle,
                background: 'rgba(239,68,68,0.14)',
                border: '1px solid rgba(239,68,68,0.45)',
                color: '#fca5a5',
              }}
            >
              Xóa tin
            </button>
          </div>
        </div>
      ))}
    </section>
  )
}

export default RecruiterJobList

