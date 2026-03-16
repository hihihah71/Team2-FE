// Trang homepage cho phép chọn loại người dùng (sinh viên / nhà tuyển dụng)

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { ROUTES } from "../../constants/routes"
import TopNavbar from "../../components/layout/TopNavbar"
import UserTypeCard from "../../components/home/UserTypeCard"
import AuthModal from "../../components/auth/AuthModal"
import { JobCard } from "../../components/job/JobCard"
import { getJobs } from "../../features/jobs/jobsService"
import type { JobItem } from "../../types/domain"
import "../PageUI.css"

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
      const to =
        user.role === "student"
          ? ROUTES.STUDENT_DASHBOARD
          : ROUTES.RECRUITER_DASHBOARD

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
        <div className="page-ui__container">
          <p className="page-ui__muted">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (user) return null

  const openAuth = (mode: AuthMode, role: UserRole) => {
    setSelectedRole(role)
    setAuthMode(mode)
  }

  return (
    <div className="page-ui">
      <div className="page-ui__container">
      <div
        style={{
          width: "100%",
          backgroundColor: "rgba(2, 6, 23, 0.75)",
          backdropFilter: "blur(12px)",
          borderRadius: "16px",
          padding: "0 48px 32px 48px",
          boxShadow: "0 25px 50px -12px rgba(15,23,42,0.9)",
          border: "1px solid rgba(148,163,184,0.35)",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <TopNavbar
          onOpenLogin={() => openAuth("login", "student")}
          onOpenRegister={() => openAuth("register", "student")}
        />

        <header style={{ marginBottom: "8px" }}>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Nền tảng quản lý CV cho sinh viên & nhà tuyển dụng
          </h1>

          <p style={{ color: "#9ca3af", maxWidth: "720px", fontSize: "14px" }}>
            Theo dõi toàn bộ vòng đời hồ sơ — từ upload CV, nộp vào từng job cho
            tới khi được shortlist, phỏng vấn và nhận offer — tất cả trong một
            giao diện thống nhất.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
          }}
        >
          <UserTypeCard
            title="Tôi là sinh viên"
            description="Tạo hồ sơ cá nhân, upload nhiều phiên bản CV và nộp vào các vị trí phù hợp."
            bullets={[
              "Quản lý danh sách CV của bạn",
              "Theo dõi trạng thái từng lượt ứng tuyển",
              "Gợi ý công việc theo ngành học",
            ]}
            buttonText="Đăng nhập dành cho sinh viên"
            onButtonClick={() => openAuth("login", "student")}
            variant="student"
          />

          <UserTypeCard
            title="Tôi là nhà tuyển dụng"
            description="Tạo tin tuyển dụng, xem nhanh các CV phù hợp và lọc ứng viên theo tiêu chí của bạn."
            bullets={[
              "Quản lý tin tuyển dụng theo từng vị trí",
              "Xem danh sách CV đã apply theo job",
              "Đánh dấu shortlist, từ chối, mời phỏng vấn",
            ]}
            buttonText="Đăng nhập dành cho nhà tuyển dụng"
            onButtonClick={() => openAuth("login", "recruiter")}
            variant="recruiter"
          />
        </div>

        <section className="page-ui__card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <h2 style={{ margin: 0 }}>Việc làm nổi bật</h2>
            <Link to={ROUTES.STUDENT_JOBS} className="page-ui__button page-ui__button--primary">
              Khám phá tất cả jobs
            </Link>
          </div>
          {featuredJobs.length === 0 ? (
            <p className="page-ui__muted">Chưa có dữ liệu việc làm nổi bật.</p>
          ) : (
            <div className="page-ui__grid page-ui__grid--two-cols" style={{ marginTop: "12px" }}>
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
      </div>
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

export default HomePage