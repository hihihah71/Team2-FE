import { useEffect, useState } from "react"
import { apiGet } from "../../services/httpClient"
import { Link } from "react-router-dom"
import { ROUTES } from "../../constants/routes"

const RecruiterJobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const fetchJobs = async () => {
    try {
      const response: any = await apiGet("/jobs/my/list")

      console.log("Recruiter jobs:", response)

      setJobs(response)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  fetchJobs()
}, [])

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#020617", color: "#e5e7eb", padding: "24px" }}>
      {/* Header */}
      <header style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "6px" }}>
            Quản lý tin tuyển dụng
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            Tất cả bài đăng của bạn.
          </p>
        </div>

        <Link
          to={ROUTES.RECRUITER_JOB_CREATE}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "#fff",
            fontWeight: 600,
            textDecoration: "none"
          }}
        >
          Đăng tin mới
        </Link>
      </header>

      {/* Jobs List */}
      <section style={{ borderRadius: "12px", border: "1px solid rgba(55,65,81,1)", overflow: "hidden" }}>
        {loading && (
          <p style={{ padding: "20px" }}>Đang tải...</p>
        )}

        {!loading && jobs.length === 0 && (
          <p style={{ padding: "20px", color: "#9ca3af" }}>
            Chưa có bài đăng nào.
          </p>
        )}

        {!loading && jobs.length > 0 && jobs.map((job) => (
          <div
            key={job._id}
            style={{
              display: "flex",
              gap: "20px",
              padding: "20px",
              borderBottom: "1px solid #1e293b",
              alignItems: "center"
            }}
          >
            {/* Image */}
            {job.imageUrl && (
              <img
                src={job.imageUrl}
                alt=""
                style={{
                  width: "120px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />
            )}

            {/* Job Info */}
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: "6px", fontSize: "18px" }}>
                {job.title}
              </h3>

              <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                {job.company} • {job.location}
              </div>

              <div style={{ marginTop: "6px", fontSize: "14px", fontWeight: 600, color: "#22c55e" }}>
                💰 {job.salaryMin?.toLocaleString()} VND
              </div>

              {job.phone && (
                <div style={{ fontSize: "13px", color: "#64748b" }}>
                  📞 {job.phone}
                </div>
              )}

              {job.description && (
                <p style={{ marginTop: "8px", color: "#cbd5e1", fontSize: "14px" }}>
                  {job.description.length > 120 ? job.description.slice(0, 120) + "..." : job.description}
                </p>
              )}
            </div>

            {/* Edit Button */}
            <Link to={ROUTES.RECRUITER_JOB_STATS?.replace(':jobId', job._id) || `/recruiter/jobs/${job._id}/stats`}>
              <button
                style={{
                  padding: "8px 14px",
                  background: "#22c55e",
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Chi tiết
              </button>
            </Link>
          </div>
        ))}
      </section>

      {/* Back */}
      <p style={{ marginTop: "16px" }}>
        <Link to={ROUTES.RECRUITER_DASHBOARD} style={{ color: "#60a5fa", textDecoration: "none" }}>
          ← Về trang tổng quan
        </Link>
      </p>
    </div>
  )
}

export default RecruiterJobsPage