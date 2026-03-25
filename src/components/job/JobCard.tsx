import { Link } from 'react-router-dom'
import type { JobItem } from '../../types/domain'

type JobCardProps = {
  job: JobItem
  detailPath: string
  actionLabel?: string
}

export const JobCard = ({ job, detailPath }: JobCardProps) => {
  const salaryText =
    job.salaryMin != null
      ? `${job.salaryMin.toLocaleString('vi-VN')} - ${(job.salaryMax ?? job.salaryMin).toLocaleString('vi-VN')} VND`
      : 'Thoả thuận'
  const createdAtText = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('vi-VN')
    : 'Không rõ'

  return (
    <Link to={detailPath} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="page-ui__card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <h3 className="page-ui__text-break" style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>{job.title}</h3>
            <p className="page-ui__muted page-ui__text-break" style={{ margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {job.company || job.companyName || 'Doanh nghiệp'}
              {job.isVerifiedRecruiter && (
                <span title="Nhà tuyển dụng đã được xác minh" style={{ display: 'inline-flex', color: '#3b82f6' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px' }}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </span>
              )}
              · {job.location || 'N/A'}
            </p>
          </div>
          {job.imageUrl && (
            <img
              src={job.imageUrl}
              alt={job.title}
              style={{ width: '78px', height: '54px', objectFit: 'cover', borderRadius: '8px' }}
            />
          )}
        </div>
        <p style={{ margin: 0, color: '#86efac', fontWeight: 700 }}>💰 {salaryText}</p>
        {job.tags && job.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {job.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 500,
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(129, 140, 248, 0.3)',
                  color: '#c7d2fe',
                }}
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 5 && (
              <span style={{ fontSize: '11px', color: '#64748b', alignSelf: 'center' }}>
                +{job.tags.length - 5}
              </span>
            )}
          </div>
        )}
        {job.description && (
          <p className="page-ui__muted" style={{ margin: 0 }}>
            {job.description.length > 120 ? `${job.description.slice(0, 120)}...` : job.description}
          </p>
        )}
        <span className="page-ui__muted" style={{ fontSize: '12px' }}>Đăng ngày: {createdAtText}</span>
      </article>
    </Link>
  )
}
