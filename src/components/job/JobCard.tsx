import { Link } from 'react-router-dom'
import type { JobItem } from '../../types/domain'

type JobCardProps = {
  job: JobItem
  detailPath: string
  actionLabel?: string
}

export const JobCard = ({ job, detailPath, actionLabel = 'Xem chi tiết' }: JobCardProps) => {
  const salaryText =
    job.salaryMin != null
      ? `${job.salaryMin.toLocaleString('vi-VN')} - ${(job.salaryMax ?? job.salaryMin).toLocaleString('vi-VN')} VND`
      : 'Thoả thuận'
  const createdAtText = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('vi-VN')
    : 'Không rõ'

  return (
    <article className="page-ui__card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>{job.title}</h3>
          <p className="page-ui__muted" style={{ margin: '6px 0 0' }}>
            {job.company || job.companyName || 'Doanh nghiệp'} • {job.location || 'N/A'}
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
      {job.description && (
        <p className="page-ui__muted" style={{ margin: 0 }}>
          {job.description.length > 120 ? `${job.description.slice(0, 120)}...` : job.description}
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="page-ui__muted">Đăng ngày: {createdAtText}</span>
        <Link className="page-ui__button page-ui__button--primary" to={detailPath}>
          {actionLabel}
        </Link>
      </div>
    </article>
  )
}
