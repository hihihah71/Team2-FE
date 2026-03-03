// Trang chính tìm việc — Người xin việc
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { apiGet } from '../../services/httpClient'
import { API_ENDPOINTS } from '../../constants/api'
import type { Job } from '../../types/job'
import StudentJobFilters from '../../components/jobs/StudentJobFilters'
import StudentJobList from '../../components/jobs/StudentJobList'
import StudentJobCreateForm from '../../components/jobs/StudentJobCreateForm'

const StudentJobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    apiGet<Job[]>(API_ENDPOINTS.JOBS_LIST)
      .then((data) => {
        if (!cancelled) {
          setJobs(Array.isArray(data) ? data : [])
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Không thể tải danh sách công việc.'
        setError(message)
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredJobs = jobs.filter((job) => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return true
    const text = `${job.title ?? ''} ${job.companyName ?? ''} ${job.location ?? ''}`.toLowerCase()
    return text.includes(keyword)
  })

  const handleJobCreated = (job: Job) => {
    setJobs((prev) => [job, ...prev])
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#020617',
        color: '#e5e7eb',
        padding: '24px',
      }}
    >
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>
          Tìm việc
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Duyệt tin tuyển dụng, lọc theo vị trí, kinh nghiệm, công ty. Click vào bài đăng để xem chi tiết và nộp CV.
        </p>
      </header>
      <section
        style={{
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(55,65,81,1)',
        }}
      >
        <StudentJobFilters
          search={search}
          onSearchChange={setSearch}
          loading={loading}
          total={filteredJobs.length}
        />

        {error && (
          <p style={{ color: '#fca5a5', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
        )}

        <StudentJobList
          jobs={filteredJobs}
          loading={loading}
          hasFilter={search.trim().length > 0}
        />

        <StudentJobCreateForm onCreated={handleJobCreated} />
      </section>
      <p style={{ marginTop: '16px' }}>
        <Link to={ROUTES.STUDENT_MY_JOBS} style={{ color: '#60a5fa' }}>
          Xem đơn đã apply & đã lưu →
        </Link>
      </p>
    </div>
  )
}

export default StudentJobsPage
