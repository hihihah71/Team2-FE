import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import StudentMyApplicationsSection from '../../components/student/StudentMyApplicationsSection'
import StudentSavedJobsSection from '../../components/student/StudentSavedJobsSection'
import { getMyApplicationsAndSavedJobs } from '../../features/applications/applicationsService'
import type { ApplicationsMeResponse } from '../../types/domain'
import { PageHeader } from '../../components/common/PageHeader'
import './StudentMyJobsPage.css'
import '../PageUI.css'

const StudentMyJobsPage = () => {
  const [data, setData] = useState<ApplicationsMeResponse | null>(null)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getMyApplicationsAndSavedJobs()
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : 'Không thể tải dữ liệu đơn ứng tuyển.'
          setError(message)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredApplications = useMemo(() => {
    const items = data?.applications ?? []

    return items.filter((app) => {
      const job = typeof app.jobId === 'string' ? null : app.jobId

      const text = `${job?.title || ''} ${job?.company || ''} ${job?.location || ''}`.toLowerCase()

      const passKeyword = keyword.trim()
        ? text.includes(keyword.trim().toLowerCase())
        : true

      const passStatus =
        statusFilter === 'all' ? true : app.status === statusFilter

      return passKeyword && passStatus
    })
  }, [data?.applications, keyword, statusFilter])

  return (
    <div className="page-ui">
      <div className="page-ui__container">
        <PageHeader
          title="Đơn đã ứng tuyển & Đã lưu"
          subtitle="Theo dõi tiến độ ứng tuyển bằng bộ lọc theo từ khóa và trạng thái."
        />

        {error && <p className="page-ui__error">{error}</p>}

        <section className="student-myjobs-grid page-ui__card">
          {/* FILTER */}
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '10px'
            }}
          >
            <input
              className="page-ui__input"
              placeholder="Tìm theo vị trí, công ty, địa điểm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <select
              className="page-ui__input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">pending</option>
              <option value="shortlisted">shortlisted</option>
              <option value="interview">interview</option>
              <option value="offered">offered</option>
              <option value="rejected">rejected</option>
            </select>
          </div>

          {/* LEFT COLUMN */}
          <div
            className="student-myjobs-column"
            style={{ paddingRight: '8px' }}
          >
            <h2>Đã ứng tuyển</h2>
            <StudentMyApplicationsSection
              applications={filteredApplications}
              loading={loading}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div
            className="student-myjobs-column"
            style={{ paddingLeft: '8px' }}
          >
            <h2>Đã lưu / Đánh dấu</h2>
            <StudentSavedJobsSection
              jobs={data?.savedJobs ?? []}
              loading={loading}
            />
          </div>
        </section>

        <p style={{ marginTop: '16px' }}>
          <Link
            to={ROUTES.STUDENT_DASHBOARD}
            className="page-ui__back-link"
          >
            ← Về trang tổng quan
          </Link>
        </p>
      </div>
    </div>
  )
}

export default StudentMyJobsPage