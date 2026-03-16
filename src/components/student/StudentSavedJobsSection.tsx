import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import type { JobItem } from '../../types/domain'

type Props = {
  jobs: JobItem[]
  loading: boolean
}

const StudentSavedJobsSection = ({ jobs, loading }: Props) => {
  if (loading) {
    return <p style={{ color: '#9ca3af', fontSize: '14px' }}>Đang tải danh sách tin đã lưu...</p>
  }

  if (!jobs.length) {
    return (
      <p style={{ color: '#9ca3af', fontSize: '14px' }}>
        Bạn chưa lưu công việc nào. Hãy bấm nút Lưu trên các tin hấp dẫn.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {jobs.map((job) => {
        const detailUrl = job._id ? ROUTES.STUDENT_JOB_DETAIL.replace(':jobId', job._id) : ''
        return (
        <Link
          key={job._id}
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
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>
            {job.title || 'Vị trí không xác định'}
          </p>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
            {job.company || 'Công ty không xác định'} • {job.location || 'Địa điểm linh hoạt'}
          </p>
        </Link>
        )
      })}
    </div>
  )
}

export default StudentSavedJobsSection

