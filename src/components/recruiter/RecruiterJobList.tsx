import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import type { JobItem } from '../../types/domain'
import { StatusBadge } from '../common/StatusBadge'
import '../../pages/PageUI.css'

type Props = {
  jobs: JobItem[]
  loading: boolean
}

const RecruiterJobList = ({ jobs, loading }: Props) => {
  if (loading) {
    return <p className="page-ui__muted" style={{ padding: '20px' }}>Đang tải...</p>
  }

  if (!jobs.length) {
    return (
      <p className="page-ui__muted" style={{ padding: '20px' }}>
        Chưa có bài đăng nào. Hãy tạo tin đầu tiên của bạn.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {jobs.map((job) => (
        <Link
          key={job._id}
          to={ROUTES.RECRUITER_JOB_DETAIL.replace(':jobId', job._id)}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <article
            className="page-ui__card"
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            {job.imageUrl && (
              <img
                src={job.imageUrl}
                alt=""
                style={{
                  width: '90px',
                  height: '64px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  flexShrink: 0,
                }}
              />
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {job.title}
                </h3>
                <StatusBadge status={job.status || 'draft'} />
              </div>
              <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                {job.company} · {job.location || 'Chưa rõ'}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '13px' }}>
                <span style={{ color: '#86efac', fontWeight: 600 }}>
                  {job.salaryMin != null
                    ? `${job.salaryMin.toLocaleString('vi-VN')} VND`
                    : 'Thoả thuận'}
                </span>
                <span style={{ color: '#93c5fd' }}>
                  {(job.detailViewCount ?? 0).toLocaleString('vi-VN')} lượt xem
                </span>
                {job.createdAt && (
                  <span style={{ color: '#64748b' }}>
                    {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <Link
                to={ROUTES.RECRUITER_JOB_EDIT.replace(':jobId', job._id)}
                className="page-ui__btn page-ui__btn--secondary"
                style={{ textDecoration: 'none', fontSize: '12px', padding: '8px 14px' }}
                onClick={(e) => e.stopPropagation()}
              >
                Chỉnh sửa
              </Link>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}

export default RecruiterJobList

