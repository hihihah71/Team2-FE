import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ROUTES } from '../../constants/routes'
import { getJobById } from '../../features/jobs/jobsService'
import type { JobItem } from '../../types/domain'
import { PageHeader } from '../../components/common/PageHeader'
import '../PageUI.css'

const RecruiterBrowseJobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [job, setJob] = useState<JobItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!jobId) return
    setLoading(true)
    setError(null)
    getJobById(jobId)
      .then(setJob)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Không thể tải thông tin công việc.')
        setJob(null)
      })
      .finally(() => setLoading(false))
  }, [jobId])

  if (loading) {
    return (
      <div className="page-ui">
        <div className="page-ui__container">
          <p className="page-ui__muted">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="page-ui">
        <div className="page-ui__container">
          <PageHeader
            title="Không tìm thấy"
            backTo={ROUTES.RECRUITER_BROWSE_JOBS}
            backLabel="Quay lại thị trường tuyển dụng"
          />
          <p className="page-ui__muted">{error || 'Công việc không tồn tại hoặc đã bị xóa.'}</p>
        </div>
      </div>
    )
  }

  const salaryText =
    job.salaryMin != null
      ? `${job.salaryMin.toLocaleString('vi-VN')} VND${job.salaryMax != null ? ` - ${job.salaryMax.toLocaleString('vi-VN')} VND` : ''}`
      : 'Thoả thuận'

  return (
    <div className="page-ui">
      <div className="page-ui__container">
        <PageHeader
          title={job.title}
          subtitle={`${job.company} · ${job.location || 'Không rõ địa điểm'} · ${salaryText}`}
          backTo={ROUTES.RECRUITER_BROWSE_JOBS}
          backLabel="Quay lại thị trường tuyển dụng"
        />

        {error && <p className="page-ui__error">{error}</p>}

        <section className="page-ui__card" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Thông tin chung</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              marginTop: '14px',
            }}
          >
            <InfoItem label="Công ty" value={job.company} />
            <InfoItem label="Địa điểm" value={job.location || 'Không rõ'} />
            <InfoItem label="Mức lương" value={salaryText} highlight />
            <InfoItem
              label="Kinh nghiệm"
              value={job.experienceYears != null ? `${job.experienceYears} năm` : 'Không yêu cầu'}
            />
            <InfoItem
              label="Hạn nộp"
              value={
                job.deadline
                  ? new Date(job.deadline).toLocaleDateString('vi-VN')
                  : 'Không có hạn'
              }
            />
            <InfoItem
              label="Ngày đăng"
              value={
                job.createdAt
                  ? new Date(job.createdAt).toLocaleDateString('vi-VN')
                  : 'Không rõ'
              }
            />
            <InfoItem label="Trạng thái" value={job.status || 'open'} />
            <InfoItem
              label="Lượt xem"
              value={String(job.detailViewCount ?? 0)}
            />
          </div>
        </section>

        <section className="page-ui__card" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Mô tả công việc</h3>
          <p style={{ color: '#d1d5db', marginTop: '10px', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
            {job.description || 'Không có mô tả.'}
          </p>
        </section>

        {job.requirements && (
          <section className="page-ui__card" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Yêu cầu ứng viên</h3>
            <p style={{ color: '#d1d5db', marginTop: '10px', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
              {job.requirements}
            </p>
          </section>
        )}

        {job.tags && job.tags.length > 0 && (
          <section className="page-ui__card">
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Tags</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '14px',
                    fontSize: '12px',
                    fontWeight: 500,
                    background: 'rgba(99, 102, 241, 0.2)',
                    border: '1px solid rgba(129, 140, 248, 0.35)',
                    color: '#c7d2fe',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function InfoItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="page-ui__muted" style={{ margin: 0, fontSize: '12px' }}>
        {label}
      </p>
      <p
        style={{
          margin: '2px 0 0',
          fontSize: '14px',
          fontWeight: 600,
          color: highlight ? '#86efac' : '#e2e8f0',
        }}
      >
        {value}
      </p>
    </div>
  )
}

export default RecruiterBrowseJobDetailPage
