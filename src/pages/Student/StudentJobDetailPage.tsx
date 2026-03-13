import { useParams, Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { apiGet, apiPost } from "../../services/httpClient"
import { ROUTES } from "../../constants/routes"

const StudentJobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>()

  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Prevent double view increment (React StrictMode fix)


  useEffect(() => {
    const fetchJobData = async () => {
      try {
        // 1️⃣ Increment view count (only once)
        

        // 2️⃣ Fetch job data
        const data = await apiGet(`/jobs/${jobId}`)
        setJob(data)

      } catch (error) {
        console.error("Failed to fetch job", error)
      } finally {
        setLoading(false)
      }
    }

    if (jobId) fetchJobData()
  }, [jobId])

  const handleApply = async () => {
    try {
      await apiPost("/applications", { jobId: job._id })
      alert("Ứng tuyển thành công!")
    } catch (error) {
      console.error("Apply failed", error)
      alert("Không thể ứng tuyển.")
    }
  }

  if (loading) {
    return <p style={{ color: "white", padding: "20px" }}>Loading...</p>
  }

  if (!job) {
    return <p style={{ color: "white", padding: "20px" }}>Không tìm thấy công việc</p>
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        color: "#e5e7eb",
        padding: "24px",
      }}
    >
      <Link
        to={ROUTES.STUDENT_JOBS}
        style={{
          color: "#94a3b8",
          fontSize: "14px",
          marginBottom: "16px",
          display: "inline-block",
        }}
      >
        ← Quay lại tìm việc
      </Link>

      <header style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 700 }}>{job.title}</h1>
        <p style={{ color: "#9ca3af" }}>{job.company}</p>
        <p style={{ color: "#9ca3af" }}>
          📍 {job.location || "Không rõ địa điểm"}
        </p>
        <p style={{ color: "#9ca3af" }}>
          💰 {job.salaryMin || "?"} - {job.salaryMax || "?"}
        </p>
      </header>

      <section
        style={{
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid rgba(55,65,81,1)",
          maxWidth: "720px",
        }}
      >
        <h3>Mô tả công việc</h3>

        <p
          style={{
            color: "#d1d5db",
            marginTop: "10px",
            whiteSpace: "pre-wrap",
          }}
        >
          {job.description || "Không có mô tả."}
        </p>

        <button
          onClick={handleApply}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "8px",
            background:
              "linear-gradient(135deg, rgba(59,130,246,1), rgba(129,140,248,1))",
            color: "#fff",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Nộp CV / Ứng tuyển
        </button>
      </section>
    </div>
  )
}

export default StudentJobDetailPage