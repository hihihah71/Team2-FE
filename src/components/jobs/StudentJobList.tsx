import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import type { Job } from '../../types/job'

type StudentJobListProps = {
  jobs: Job[]
  loading: boolean
  hasFilter: boolean
}

const formatSalary = (job: Job) => {
  if (job.salaryFrom == null && job.salaryTo == null) return 'Thỏa thuận'
  if (job.salaryFrom != null && job.salaryTo != null) {
    return `${job.salaryFrom.toLocaleString('vi-VN')} - ${job.salaryTo.toLocaleString('vi-VN')} VND`
  }
  if (job.salaryFrom != null) {
    return `Từ ${job.salaryFrom.toLocaleString('vi-VN')} VND`
  }
  return `Đến ${job.salaryTo!.toLocaleString('vi-VN')} VND`
}

const StudentJobList = ({ jobs, loading, hasFilter }: StudentJobListProps) => {
  if (loading && !jobs.length) {
    return <p style={{ color: '#9ca3af', fontSize: '14px' }}>Đang tải danh sách công việc...</p>
  }

  if (!loading && !jobs.length) {
    return (
      <p style={{ color: '#9ca3af', fontSize: '14px' }}>
        {hasFilter ? 'Chưa có công việc nào phù hợp với từ khóa hiện tại.' : 'Hiện chưa có công việc nào.'}
      </p>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      {jobs.map((job) => (
        <Link
          key={job.id}
          to={ROUTES.STUDENT_JOB_DETAIL.replace(':jobId', String(job.id))}
          style={{
            textDecoration: 'none',
            borderRadius: '12px',
            padding: '14px',
            border: '1px solid rgba(55,65,81,1)',
            background:
              'radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent), #020617',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#e5e7eb',
              marginBottom: '2px',
            }}
          >
            {job.title || 'Vị trí chưa có tên'}
          </h3>
          <p style={{ fontSize: '13px', color: '#9ca3af' }}>
            {job.companyName || 'Công ty chưa cập nhật'}
          </p>
          <p style={{ fontSize: '13px', color: '#9ca3af' }}>
            {job.location || 'Địa điểm linh hoạt'}
          </p>
          <p style={{ fontSize: '13px', color: '#a5b4fc', marginTop: '4px' }}>{formatSalary(job)}</p>
        </Link>
      ))}
    </div>
  )
}

export default StudentJobList

