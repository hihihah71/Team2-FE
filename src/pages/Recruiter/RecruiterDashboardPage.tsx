import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { getRecruiterDashboardStats } from '../../features/dashboard/dashboardService'
import { getJobs } from '../../features/jobs/jobsService'
import type { JobItem, RecruiterDashboardStats } from '../../types/domain'
import { PageHeader } from '../../components/common/PageHeader'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { JobCard } from '../../components/job/JobCard'
import { Pagination } from '../../components/common/Pagination'
import './RecruiterDashboardPage.css'
import '../PageUI.css'

const RecruiterDashboardPage = () => {
  const [stats, setStats] = useState<RecruiterDashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recentJobs, setRecentJobs] = useState<JobItem[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 6

  useEffect(() => {
    getRecruiterDashboardStats()
      .then(setStats)
      .catch((err: unknown) => {
        console.error('Failed to fetch recruiter dashboard stats:', err)
        setError(err instanceof Error ? err.message : 'Không thể tải thống kê.')
      })
  }, [])

  useEffect(() => {
    setJobsLoading(true)
    getJobs({ page: 1, limit: 60 })
      .then((data) => setRecentJobs(data.items))
      .catch(() => setRecentJobs([]))
      .finally(() => setJobsLoading(false))
  }, [])

  const totalPages = Math.max(1, Math.ceil(recentJobs.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pagedJobs = recentJobs.slice((safePage - 1) * pageSize, safePage * pageSize)

  return (
    <div className="page-ui">
      <div className="page-ui__container">
        <PageHeader
          title="Xin chào, nhà tuyển dụng 👋"
          subtitle="Theo dõi hiệu suất tuyển dụng và xử lý ứng viên nhanh hơn."
        />

        {error && <p className="page-ui__error">{error}</p>}

        <section className="page-ui__kpi-grid" style={{ marginBottom: '24px' }}>
          <StatsCard label="Tổng số tin" value={stats ? stats.totalJobs : '—'} accent="blue" />
          <StatsCard label="Tin đang mở" value={stats ? stats.openJobs : '—'} accent="green" />
          <StatsCard
            label="Tổng số đơn ứng tuyển"
            value={stats ? stats.totalApplications : '—'}
            accent="purple"
          />
          <StatsCard label="Đơn mới hôm nay" value={stats ? stats.todayApplications : '—'} accent="green" />
        </section>

        <section className="page-ui__card" style={{ marginBottom: '24px' }}>
          <h2 style={{ marginTop: 0 }}>Lối tắt tuyển dụng</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to={ROUTES.RECRUITER_JOBS} className="page-ui__button page-ui__button--primary">
              Quản lý tin tuyển dụng
            </Link>
            <Link to={ROUTES.RECRUITER_JOB_CREATE} className="page-ui__button page-ui__button--secondary">
              Đăng tin mới
            </Link>
            <Link to={ROUTES.RECRUITER_BROWSE_JOBS} className="page-ui__button page-ui__button--secondary">
              Xem thị trường tuyển dụng
            </Link>
          </div>
        </section>

        <section className="page-ui__card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Công việc đang tuyển trên nền tảng</h2>
              <p className="page-ui__muted" style={{ margin: '4px 0 0' }}>
                Các vị trí mới nhất đang được rao tuyển bởi tất cả nhà tuyển dụng
              </p>
            </div>
            <Link to={ROUTES.RECRUITER_BROWSE_JOBS} className="page-ui__button page-ui__button--primary">
              Xem tất cả
            </Link>
          </div>

          {jobsLoading ? (
            <p className="page-ui__muted">Đang tải danh sách việc làm...</p>
          ) : pagedJobs.length === 0 ? (
            <p className="page-ui__muted">Hiện chưa có công việc nào được đăng trên nền tảng.</p>
          ) : (
            <div className="page-ui__grid page-ui__grid--two-cols">
              {pagedJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  detailPath={ROUTES.RECRUITER_BROWSE_JOB_DETAIL.replace(':jobId', job._id)}
                />
              ))}
            </div>
          )}

          <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
        </section>
      </div>
    </div>
  )
}

export default RecruiterDashboardPage
