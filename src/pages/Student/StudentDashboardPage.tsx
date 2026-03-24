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
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      title: "Tuyển dụng Part-time & Thực tập sinh",
      subtitle: "Hàng ngàn cơ hội việc làm hấp dẫn dành cho sinh viên",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
      title: "Chương trình Job Fair 2026",
      subtitle: "Kết nối trực tiếp với nhà tuyển dụng",
    },
  ]

  /* ---------------- FETCH DATA ---------------- */
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStudentDashboardStats()
        setStats({
          ...data,
          upcomingInterviews: data.upcomingInterviews || [] 
        })
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

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

  /* ---------------- STYLES ---------------- */
  const curvedContainerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden'
  }

  const blueStripe = (
    <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '4px',
      backgroundColor: '#3b82f6',
      borderRadius: '4px 0 0 4px', // This ensures it curves with the box corner
      zIndex: 1
    }} />
  )

  /* ---------------- RENDER ---------------- */
  return (
    <div className="page-ui">
      <div className="page-ui__container">
        <div className="student-discovery-container">
          
          <div className="top-section">
            <PageHeader
              title={`Chào buổi sáng, ${user?.fullName || 'Sinh Viên'}! `}
              subtitle="Các công việc mới đang chờ bạn khám phá."
            />
          </div>

          {/* Banner - No Stripe */}
          <div className="hero-section page-ui__card" style={{ padding: '0', marginBottom: '24px' }}>
            <div className="banner-slider">
              {banners.map((banner, index) => (
                <div key={banner.id} className={`banner-slide ${index === currentBanner ? 'active' : ''}`}>
                  <img src={banner.image} alt={banner.title} className="banner-bg" />
                  <div className="banner-overlay"></div>
                  <div className="banner-content">
                    <h2>{banner.title}</h2>
                    <p>{banner.subtitle}</p>
                    <Link to={ROUTES.STUDENT_JOBS} className="banner-btn">Khám phá ngay</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid - No Stripe */}
          <div className="student-stats-grid page-ui__kpi-grid">
            <StatsCard label="Đơn đã ứng tuyển" value={stats ? stats.totalApplications : '—'} accent="blue" />
            <StatsCard label="Đã shortlist" value={stats ? stats.shortlisted : '—'} accent="green" />
            <StatsCard label="Lịch phỏng vấn" value={stats ? stats.interviews : '0'} accent="purple" />
            <StatsCard label="Tin đã lưu" value={stats ? stats.savedJobs : '—'} accent="purple" />
            <StatsCard label="CV đang dùng" value={stats?.defaultCvName || 'Chưa chọn'} accent="blue" />
          </div>

          {/* 1. Lịch phỏng vấn - WITH CURVED STRIPE */}
          <section className="page-ui__card" style={{ ...curvedContainerStyle, marginTop: '20px' }}>
            {blueStripe}
            <div style={{ paddingLeft: '12px' }}> {/* Small offset so text doesn't touch stripe */}
              <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📅</span> Lịch phỏng vấn sắp tới
              </h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {stats?.upcomingInterviews && stats.upcomingInterviews.length > 0 ? (
                  stats.upcomingInterviews.map((interview) => (
                    <div key={interview._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                      <div>
                        <p style={{ fontWeight: 600, margin: 0 }}>{interview.jobTitle}</p>
                        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>{interview.company}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: '#60a5fa', fontWeight: 600, margin: 0 }}>
                          {new Date(interview.interviewDate).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                        </p>
                        <Link to={ROUTES.STUDENT_JOB_DETAIL.replace(':jobId', interview.jobId)} style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'underline' }}>Chi tiết</Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Bạn hiện chưa có lịch phỏng vấn nào.</p>
                )}
              </div>
            </div>
          </section>

          {/* 2. Việc làm mới nhất - WITH CURVED STRIPE */}
          <div className="content-sections">
            <section className="job-section page-ui__card" style={curvedContainerStyle}>
              {blueStripe}
              <div style={{ paddingLeft: '12px' }}>
                <div className="section-header">
                  <div>
                    <h2 className="section-title"> Việc làm mới nhất</h2>
                    <p className="section-desc">Các công việc được đăng gần đây từ nhà tuyển dụng</p>
                  </div>
                  <Link to={ROUTES.STUDENT_JOBS} className="see-all-btn">Xem tất cả</Link>
                </div>

                <div className="job-cards-grid">
                  {currentJobs.length === 0 ? (
                    <p style={{ color: '#94a3b8' }}>Hiện chưa có việc làm nào được đăng.</p>
                  ) : (
                    currentJobs.map((job) => (
                      <JobCard key={job._id} job={job} detailPath={ROUTES.STUDENT_JOB_DETAIL.replace(':jobId', job._id)} />
                    ))
                  )}
                </div>
                <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  )
}

export default StudentDashboardPage