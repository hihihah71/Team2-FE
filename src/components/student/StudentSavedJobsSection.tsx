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
      {jobs.map((job) => (
        <div
          key={job._id}
          style={{
            borderRadius: '10px',
            padding: '12px 14px',
            border: '1px solid rgba(55,65,81,1)',
            backgroundColor: '#020617',
          }}
        >
          {job._id ? (
            <Link
              to={ROUTES.STUDENT_JOB_DETAIL.replace(':jobId', job._id)}
              style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', textDecoration: 'none' }}
            >
              {job.title || 'Vị trí không xác định'}
            </Link>
          ) : (
            <p style={{ fontSize: '14px', fontWeight: 600 }}>{job.title || 'Vị trí không xác định'}</p>
          )}
          <p style={{ fontSize: '13px', color: '#9ca3af' }}>
            {job.company || 'Công ty không xác định'} • {job.location || 'Địa điểm linh hoạt'}
          </p>
        </div>
      ))}
    </div>
  )
}

export default StudentSavedJobsSection

