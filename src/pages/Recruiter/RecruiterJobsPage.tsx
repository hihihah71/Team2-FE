import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import RecruiterJobList from '../../components/recruiter/RecruiterJobList'
import { getMyRecruiterJobs } from '../../features/jobs/jobsService'
import type { JobItem } from '../../types/domain'
import { PageHeader } from '../../components/common/PageHeader'
import './RecruiterJobsPage.css'
import '../PageUI.css'

const RecruiterJobsPage = () => {
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'draft' | 'closed'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getMyRecruiterJobs()
      .then((response) => setJobs(response ?? []))
      .catch((err: unknown) => {
        console.error('Error fetching jobs:', err)
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách tin tuyển dụng.')
        setJobs([])
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredJobs = jobs.filter((job) => {
    const text = `${job.title} ${job.company} ${job.location || ''}`.toLowerCase()
    const passKeyword = keyword.trim() ? text.includes(keyword.trim().toLowerCase()) : true
    const passStatus = statusFilter === 'all' ? true : job.status === statusFilter
    return passKeyword && passStatus
  })

  return (
    <div className="page-ui">
      <div className="page-ui__container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <PageHeader
            title="Quản lý tin tuyển dụng"
            subtitle={`${jobs.length} tin · Click vào tin để chỉnh sửa, đóng/mở hoặc xoá.`}
          />
          <Link to={ROUTES.RECRUITER_JOB_CREATE} className="page-ui__btn page-ui__btn--success" style={{ textDecoration: 'none' }}>
            Đăng tin mới
          </Link>
        </div>

        {error && <p className="page-ui__error">{error}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '14px' }}>
          <input
            className="page-ui__input"
            placeholder="Tìm theo tiêu đề, công ty, địa điểm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select
            className="page-ui__input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="open">Đang mở</option>
            <option value="draft">Nháp</option>
            <option value="closed">Đã đóng</option>
          </select>
        </div>

        <RecruiterJobList jobs={filteredJobs} loading={loading} />

        <p style={{ marginTop: '16px' }}>
          <Link to={ROUTES.RECRUITER_DASHBOARD} className="page-ui__back-link">← Về trang tổng quan</Link>
        </p>
      </div>
    </div>
  )
}

export default RecruiterJobsPage