// Redesigned HomePage with Hero Section and Introduction
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { ROUTES } from "../../constants/routes"
import TopNavbar from "../../components/layout/TopNavbar"
import AuthModal from "../../components/auth/AuthModal"
import { JobCard } from "../../components/job/JobCard"
import { getJobs } from "../../features/jobs/jobsService"
import type { JobItem } from "../../types/domain"
import "../PageUI.css"
import "./LandingPage.css"

type AuthMode = "login" | "register" | null
type UserRole = "student" | "recruiter" | null

const HomePage = () => {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  const [authMode, setAuthMode] = useState<AuthMode>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole>(null)
  const [featuredJobs, setFeaturedJobs] = useState<JobItem[]>([])

  useEffect(() => {
    if (loading) return
    if (user) {
      const to = user.role === "student" ? ROUTES.STUDENT_DASHBOARD : ROUTES.RECRUITER_DASHBOARD
      navigate(to, { replace: true })
    }
  }, [user, loading, navigate])

  useEffect(() => {
    getJobs({ page: 1, limit: 4 })
      .then((res) => setFeaturedJobs(res.items))
      .catch(() => setFeaturedJobs([]))
  }, [])

  if (loading) {
    return (
      <div className="page-ui">
        <div className="page-ui__container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <p className="page-ui__muted">Đang tải trải nghiệm...</p>
        </div>
      </div>
    )
  }

  if (user) return null

  const openAuth = (mode: AuthMode, role: UserRole = "student") => {
    setSelectedRole(role)
    setAuthMode(mode)
  }

  return (
    <div className="page-ui">
      <div className="page-ui__container">
        <TopNavbar
          onOpenLogin={() => openAuth("login", "student")}
          onOpenRegister={() => openAuth("register", "student")}
        />

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">Nền tảng Tuyển dụng & CV thế hệ mới</div>
            <h1 className="hero-title">
              Kiến tạo sự nghiệp, <br />
              Kết nối tương lai
            </h1>
            <p className="hero-description">
              Giải pháp toàn diện giúp sinh viên xây dựng thương hiệu cá nhân qua CV chuyên nghiệp 
              và hỗ trợ doanh nghiệp tìm kiếm những mảnh ghép tài năng hoàn hảo nhất.
            </p>
            <div className="hero-actions">
              <button 
                className="page-ui__button page-ui__button--primary" 
                style={{ padding: '12px 32px', fontSize: '15px' }}
                onClick={() => {
                  const el = document.getElementById('features');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Khám phá ngay
              </button>
            </div>
          </div>
        </section>

        {/* Features Introduction */}
        <section id="features" className="features-section">
          <div className="section-label">Chúng tôi mang lại gì?</div>
          <h2 className="section-title">Giải pháp tối ưu cho cả hai phía</h2>
          
          <div className="features-grid">
            {/* For Students */}
            <div className="feature-card">
              <div className="feature-icon-wrap feature-student-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h3 className="feature-name">Dành cho Sinh viên</h3>
              <ul className="feature-list">
                <li className="feature-item">
                  <CheckIcon /> Quản lý nhiều phiên bản CV chuyên nghiệp
                </li>
                <li className="feature-item">
                  <CheckIcon /> Theo dõi trạng thái ứng tuyển thời gian thực
                </li>
                <li className="feature-item">
                  <CheckIcon /> Nhận gợi ý công việc phù hợp với năng lực
                </li>
              </ul>
            </div>

            {/* For Recruiters */}
            <div className="feature-card">
              <div className="feature-icon-wrap feature-recruiter-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="feature-name">Dành cho Nhà tuyển dụng</h3>
              <ul className="feature-list">
                <li className="feature-item">
                  <CheckIcon /> Đăng tin tuyển dụng và quản lý chiến dịch
                </li>
                <li className="feature-item">
                  <CheckIcon /> Hệ thống lọc hồ sơ thông minh, nhanh chóng
                </li>
                <li className="feature-item">
                  <CheckIcon /> Tương tác trực tiếp và xếp lịch phỏng vấn
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Featured Jobs */}
        <section className="page-ui__card" style={{ marginTop: '80px', marginBottom: '60px' }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '24px' }}>Cơ hội việc làm mới nhất</h2>
            <Link to={ROUTES.STUDENT_JOBS} className="page-ui__button page-ui__button--primary">
              Xem tất cả
            </Link>
          </div>
          {featuredJobs.length === 0 ? (
            <p className="page-ui__muted">Đang tìm kiếm các cơ hội tốt nhất cho bạn...</p>
          ) : (
            <div className="page-ui__grid page-ui__grid--two-cols">
              {featuredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  detailPath={ROUTES.STUDENT_JOB_DETAIL.replace(":jobId", job._id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Footer info */}
        <footer style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid rgba(148, 163, 184, 0.1)', color: '#64748b', fontSize: '14px' }}>
          <p>© 2026 CV Matching Platform. Phát triển bởi Team 2.</p>
        </footer>
      </div>

      {authMode && selectedRole && (
        <AuthModal
          mode={authMode}
          role={selectedRole}
          onClose={() => {
            setAuthMode(null)
            setSelectedRole(null)
          }}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </div>
  )
}

const CheckIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" style={{ color: '#10b981' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

export default HomePage