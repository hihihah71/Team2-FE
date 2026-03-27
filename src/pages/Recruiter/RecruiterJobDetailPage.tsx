// Danh sách ứng viên đã apply vào một bài đăng — xem CV từng người
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { getApplicantsByJob } from '../../features/applications/applicationsService'
import { getJobById } from '../../features/jobs/jobsService'
import type { ApplicationItem, CvItem, JobItem, UserSummary } from '../../types/domain'
import { StatusBadge } from '../../components/common/StatusBadge'
import { PageHeader } from '../../components/common/PageHeader'
import '../PageUI.css'

const RecruiterJobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [job, setJob] = useState<JobItem | null>(null)
  const [applicants, setApplicants] = useState<ApplicationItem[]>([])
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!jobId) return
      setLoading(true)
      setError(null)
      try {
        const [appsData, jobData] = await Promise.all([getApplicantsByJob(jobId), getJobById(jobId)])
        setApplicants(appsData ?? [])
        setJob(jobData)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Không thể tải danh sách ứng viên.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchApplicants()
  }, [jobId])

  const filteredApplicants = applicants.filter((app) => {
    const candidate = (app.applicantId as UserSummary | undefined)
    const text = `${candidate?.fullName || ''} ${candidate?.email || ''}`.toLowerCase()
    const passKeyword = keyword.trim() ? text.includes(keyword.trim().toLowerCase()) : true
    const passStatus = statusFilter === 'all' ? true : app.status === statusFilter
    return passKeyword && passStatus
  })

  return (
    <div className="page-ui">
      <div className="page-ui__container">
      <PageHeader
        title={`Ứng viên bài đăng: ${job?.title || `#${jobId}`}`}
        subtitle="Lọc nhanh theo trạng thái và tìm kiếm theo tên/email ứng viên."
        backTo={ROUTES.RECRUITER_JOBS}
        backLabel="Quay lại quản lý tin tuyển dụng"
      />
      {error && (
        <p className="page-ui__error">{error}</p>
      )}
      {job?.moderationStatus === 'rejected' && (
        <p className="page-ui__error">
          Bài đăng này đã bị admin ban và đã được đóng.
        </p>
      )}
      <section className="page-ui__card">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '14px' }}>
          <input
            className="page-ui__input"
            placeholder="Tìm theo tên hoặc email ứng viên"
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
        {loading ? (
          <p className="page-ui__muted">Đang tải danh sách ứng viên...</p>
        ) : filteredApplicants.length === 0 ? (
          <p className="page-ui__muted">Chưa có ứng viên nào ứng tuyển tin này.</p>
        ) : (
          <div className="page-ui__table-wrap">
          <table className="page-ui__table">
            <thead>
              <tr>
                <th>Ứng viên</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th>CV</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map((app) => (
                <tr key={app._id}>
                  <td>
                    {(app.applicantId as UserSummary | undefined)?.fullName || '—'}
                  </td>
                  <td>
                    {(app.applicantId as UserSummary | undefined)?.email || '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <StatusBadge status={app.status} />
                      {app.status === 'rejected' && app.rejectedBy === 'student' && (
                        <span style={{ fontSize: '11px', color: '#fca5a5' }}>Ứng viên từ chối</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {(app.cvId as CvItem | undefined)?.name ||
                      (app.cvSource === 'profile_default' ? 'CV mặc định từ Profile' : '—')}
                  </td>
                  <td>
                    <Link
                      to={ROUTES.RECRUITER_APPLICANT_CV.replace(':jobId', jobId || '').replace(
                        ':applicantId',
                        (app.applicantId as UserSummary | undefined)?._id || '',
                      )}
                      style={{ color: '#60a5fa' }}
                    >
                      Xem CV →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </section>
      </div>
    </div>
  )
}

export default RecruiterJobDetailPage
