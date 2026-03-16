import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../contexts/AuthContext'
import { getStudentDashboardStats } from '../../features/dashboard/dashboardService'
import { getJobs } from '../../features/jobs/jobsService'
import type { JobItem, StudentDashboardStats } from '../../types/domain'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { JobCard } from '../../components/job/JobCard'
import { Pagination } from '../../components/common/Pagination'
import { PageHeader } from '../../components/common/PageHeader'
import './StudentDashboardPage.css'
import '../PageUI.css'

const StudentDashboardPage = () => {
  const { user } = useAuth()

  const [jobs, setJobs] = useState<JobItem[]>([])
  const [stats, setStats] = useState<StudentDashboardStats | null>(null)
  const [currentBanner, setCurrentBanner] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const jobsPerPage = 12

  const banners = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      title: "Tuyển dụng Part-time & Thực tập sinh",
      subtitle: "Hàng ngàn cơ hội việc làm hấp dẫn dành cho sinh viên",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
      title: "Chương trình Job Fair 2026",
      subtitle: "Kết nối trực tiếp với nhà tuyển dụng",
    },
  ]

  /* ---------------- FETCH JOBS ---------------- */

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs({ page: 1, limit: 60 })
        setJobs(data.items)
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
        setJobs([])
      }
    }

    fetchJobs()
  }, [])

  // --- FETCH DASHBOARD STATS ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStudentDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      }
    }

    fetchStats()
  }, [])

  /* ---------------- BANNER SLIDER ---------------- */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  /* ---------------- PAGINATION ---------------- */

  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage

  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(jobs.length / jobsPerPage)

  /* ---------------- RENDER ---------------- */

  return (
    <div className="page-ui">
      <div className="page-ui__container">
    <div className="student-discovery-container">
      <div className="top-section">
        <PageHeader
          title={`Chào buổi sáng, ${user?.fullName || 'Sinh Viên'}! 🚀`}
          subtitle="Các công việc mới đang chờ bạn khám phá."
        />
      </div>

      <div className="student-stats-grid page-ui__kpi-grid">
        <StatsCard label="Đơn đã ứng tuyển" value={stats ? stats.totalApplications : '—'} accent="blue" />
        <StatsCard label="Đã shortlist" value={stats ? stats.shortlisted : '—'} accent="green" />
        <StatsCard label="Tin đã lưu" value={stats ? stats.savedJobs : '—'} accent="purple" />
        <StatsCard label="CV đang dùng" value={stats?.defaultCvName || 'Chưa chọn'} accent="blue" />
      </div>

      {/* Banner */}

      <div className="hero-section page-ui__card" style={{ padding: '0' }}>
        <div className="banner-slider">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`banner-slide ${index === currentBanner ? 'active' : ''}`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="banner-bg"
              />

              <div className="banner-overlay"></div>

              <div className="banner-content">
                <h2>{banner.title}</h2>
                <p>{banner.subtitle}</p>

                <Link to={ROUTES.STUDENT_JOBS} className="banner-btn">
                  Khám phá ngay
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs */}

      <div className="content-sections">
        <section className="job-section page-ui__card">
          <div className="section-header">
            <div>
              <h2 className="section-title">🔥 Việc làm mới nhất</h2>
              <p className="section-desc">
                Các công việc được đăng gần đây từ nhà tuyển dụng
              </p>
            </div>

            <Link to={ROUTES.STUDENT_JOBS} className="see-all-btn">
              Xem tất cả
            </Link>
          </div>

          <div className="job-cards-grid">
            {currentJobs.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>
                Hiện chưa có việc làm nào được đăng.
              </p>
            ) : (
              currentJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  detailPath={ROUTES.STUDENT_JOB_DETAIL.replace(':jobId', job._id)}
                />
              ))
            )}
          </div>

          <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
        </section>
      </div>
    </div>
      </div>
    </div>
  )
}

export default StudentDashboardPage