import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import RecruiterJobList from '../../components/recruiter/RecruiterJobList'
import { deleteJob, getMyRecruiterJobs, updateJob } from '../../features/jobs/jobsService'
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
    const fetchJobs = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getMyRecruiterJobs()
        setJobs(response ?? [])
      } catch (err: unknown) {
        console.error('Error fetching jobs:', err)
        const message = err instanceof Error ? err.message : 'Không thể tải danh sách tin tuyển dụng.'
        setError(message)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleDelete = async (jobId: string) => {
    if (!window.confirm('Bạn chắc chắn muốn xoá tin này?')) return
    try {
      await deleteJob(jobId)
      setJobs((prev) => prev.filter((job) => job._id !== jobId))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể xoá tin tuyển dụng.'
      setError(message)
    }
  }

  const handleToggleStatus = async (job: JobItem) => {
    const nextStatus = job.status === 'open' ? 'closed' : 'open'
    try {
      const updated = await updateJob(job._id, { status: nextStatus })
      setJobs((prev) =>
        prev.map((item) =>
          item._id === job._id
            ? { ...item, status: updated.status || nextStatus }
            : item,
        ),
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái tin.'
      setError(message)
    }
  }

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
            subtitle="Tìm kiếm, lọc trạng thái, đóng/mở lại và xoá tin nhanh."
          />
          <Link to={ROUTES.RECRUITER_JOB_CREATE} className="page-ui__btn page-ui__btn--success" style={{ textDecoration: 'none' }}>
            Đăng tin mới
          </Link>
        </div>

        {error && (
          <p className="page-ui__error">{error}</p>
        )}

        <div className="page-ui__card">
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
          <RecruiterJobList
            jobs={filteredJobs}
            loading={loading}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </div>

        <p style={{ marginTop: '16px' }}>
          <Link to={ROUTES.RECRUITER_DASHBOARD} className="page-ui__back-link">← Về trang tổng quan</Link>
        </p>
      </div>
    </div>
  )
}

export default RecruiterJobsPage