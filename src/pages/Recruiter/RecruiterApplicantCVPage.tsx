// Xem chi tiết CV của ứng viên đã apply vào bài đăng
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { useParams } from 'react-router-dom'
import {
  getApplicantByJob,
  updateApplicationStatus,
} from '../../features/applications/applicationsService'
import { getJobById } from '../../features/jobs/jobsService'
import type { ApplicationItem, ApplicationStatus, CvItem, JobItem, UserSummary } from '../../types/domain'
import { PageHeader } from '../../components/common/PageHeader'
import { StatusBadge } from '../../components/common/StatusBadge'
import '../PageUI.css'

const ALLOWED_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  pending: ['shortlisted', 'interview', 'rejected'],
  shortlisted: ['interview', 'offered', 'rejected'],
  interview: ['offered', 'rejected'],
  rejected: [],
  offered: [],
}

const RecruiterApplicantCVPage = () => {
  const { jobId, applicantId } = useParams<{ jobId: string; applicantId: string }>()
  const backUrl = `/recruiter/jobs/${jobId}`

  const [job, setJob] = useState<JobItem | null>(null)
  const [appDetail, setAppDetail] = useState<ApplicationItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [showProfileCvDetails, setShowProfileCvDetails] = useState(false)

  useEffect(() => {
    const fetchDetail = async () => {
      if (!jobId || !applicantId) return
      setLoading(true)
      setError(null)
      try {
        const [appData, jobData] = await Promise.all([
          getApplicantByJob(jobId, applicantId),
          getJobById(jobId),
        ])
        setAppDetail(appData)
        setJob(jobData)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Không thể tải thông tin ứng viên.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [jobId, applicantId])

  const updateStatus = async (status: ApplicationStatus) => {
    if (!appDetail) return
    setUpdating(true)
    try {
      const updated = await updateApplicationStatus(appDetail._id, status)
      setAppDetail(updated)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái.'
      setError(message)
    } finally {
      setUpdating(false)
    }
  }

  const isTransitionAllowed = (status: ApplicationStatus) => {
    if (!appDetail) return false
    if (appDetail.status === status) return false
    return ALLOWED_TRANSITIONS[appDetail.status]?.includes(status) || false
  }

  const actionButtonBaseStyle: CSSProperties = {
    padding: '9px 14px',
    borderRadius: '10px',
    border: '1px solid transparent',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.1px',
    cursor: 'pointer',
    transition: 'filter 0.15s ease, transform 0.15s ease, opacity 0.15s ease',
  }

  return (
    <div className="page-ui">
      <div className="page-ui__container">
      <PageHeader
        title={`CV ứng viên ${(appDetail?.applicantId as UserSummary | undefined)?.fullName || `#${applicantId}`}`}
        subtitle={`Bài đăng: ${job?.title || `#${jobId}`} — Xem chi tiết CV, thông tin liên hệ, cập nhật trạng thái đơn ứng tuyển.`}
        backTo={backUrl}
        backLabel="Quay lại danh sách ứng viên"
      />
      {error && (
        <p className="page-ui__error">{error}</p>
      )}
      <section className="page-ui__card" style={{ maxWidth: '760px' }}>
        {loading || !appDetail ? (
          <p className="page-ui__muted">Đang tải chi tiết ứng viên...</p>
        ) : (
          <>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
                {(appDetail.applicantId as UserSummary).fullName}
              </h2>
              <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                {(appDetail.applicantId as UserSummary).email}
              </p>
              <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>
                Trạng thái:{' '}
                <StatusBadge status={appDetail.status} />
              </p>
              {appDetail.status === 'rejected' && appDetail.rejectedBy === 'student' && (
                <p style={{ fontSize: '12px', color: '#fca5a5', marginTop: '6px' }}>
                  Ứng viên đã chủ động từ chối công việc.
                </p>
              )}
            </div>

            {appDetail.cvId && (
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>
                  CV đã gửi
                </h3>
                <p style={{ fontSize: '14px', color: '#e5e7eb' }}>
                  {(appDetail.cvId as CvItem).name}
                </p>
                {(appDetail.cvId as CvItem).fileUrl && (
                  <div style={{ marginTop: '8px' }}>
                    <a
                      href={(appDetail.cvId as CvItem).fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="page-ui__btn page-ui__btn--primary"
                      style={{ textDecoration: 'none', display: 'inline-flex' }}
                    >
                      Xem chi tiết CV (PDF)
                    </a>
                  </div>
                )}
              </div>
            )}
            {!appDetail.cvId && appDetail.cvSource === 'profile_default' && appDetail.profileCvSnapshot && (
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>
                  CV mặc định từ Profile
                </h3>
                <p style={{ fontSize: '14px', color: '#e5e7eb', marginBottom: '6px' }}>
                  {appDetail.profileCvSnapshot.fullName} • {appDetail.profileCvSnapshot.email}
                </p>
                {appDetail.profileCvSnapshot.phone && (
                  <p style={{ fontSize: '13px', color: '#9ca3af' }}>
                    SĐT: {appDetail.profileCvSnapshot.phone}
                  </p>
                )}
                {appDetail.profileCvSnapshot.summary && (
                  <p style={{ fontSize: '14px', color: '#d1d5db', whiteSpace: 'pre-wrap' }}>
                    {appDetail.profileCvSnapshot.summary}
                  </p>
                )}
                {Array.isArray(appDetail.profileCvSnapshot.skills) &&
                  appDetail.profileCvSnapshot.skills.length > 0 && (
                    <p style={{ fontSize: '13px', color: '#93c5fd' }}>
                      Kỹ năng: {appDetail.profileCvSnapshot.skills.join(', ')}
                    </p>
                  )}
                <button
                  type="button"
                  onClick={() => setShowProfileCvDetails(true)}
                  className="page-ui__btn page-ui__btn--primary"
                  style={{ marginTop: '10px' }}
                >
                  Xem chi tiết CV từ Profile
                </button>
              </div>
            )}

            {appDetail.coverLetter && (
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>
                  Thư giới thiệu
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#d1d5db',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {appDetail.coverLetter}
                </p>
              </div>
            )}

            <div className="page-ui__actions">
              <button
                type="button"
                onClick={() => updateStatus('shortlisted')}
                disabled={updating || !isTransitionAllowed('shortlisted')}
                style={{
                  ...actionButtonBaseStyle,
                  background: 'rgba(34,197,94,0.15)',
                  borderColor: 'rgba(34,197,94,0.45)',
                  color: '#86efac',
                }}
              >
                Shortlist
              </button>
              <button
                type="button"
                onClick={() => updateStatus('interview')}
                disabled={updating || !isTransitionAllowed('interview')}
                style={{
                  ...actionButtonBaseStyle,
                  background: 'rgba(59,130,246,0.16)',
                  borderColor: 'rgba(59,130,246,0.46)',
                  color: '#bfdbfe',
                }}
              >
                Mời phỏng vấn
              </button>
              <button
                type="button"
                onClick={() => updateStatus('rejected')}
                disabled={updating || !isTransitionAllowed('rejected')}
                style={{
                  ...actionButtonBaseStyle,
                  background: 'rgba(239,68,68,0.16)',
                  borderColor: 'rgba(239,68,68,0.45)',
                  color: '#fda4af',
                }}
              >
                Từ chối
              </button>
              <button
                type="button"
                onClick={() => updateStatus('offered')}
                disabled={updating || !isTransitionAllowed('offered')}
                style={{
                  ...actionButtonBaseStyle,
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  borderColor: 'rgba(22,163,74,0.4)',
                  color: '#f0fdf4',
                  boxShadow: '0 10px 22px rgba(22,163,74,0.28)',
                }}
              >
                Gửi offer
              </button>
            </div>
            <p className="page-ui__muted" style={{ marginTop: '8px' }}>
              Hệ thống chỉ cho phép chuyển sang trạng thái hợp lệ theo pipeline tuyển dụng.
            </p>
          </>
        )}
      </section>
      {showProfileCvDetails && appDetail?.profileCvSnapshot && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 23, 0.78)',
            zIndex: 90,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
          }}
          onClick={() => setShowProfileCvDetails(false)}
        >
          <section
            className="page-ui__card"
            style={{ width: 'min(900px, 100%)', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Chi tiết CV mặc định từ Profile</h3>
              <button
                type="button"
                className="page-ui__btn page-ui__btn--secondary"
                onClick={() => setShowProfileCvDetails(false)}
              >
                Đóng
              </button>
            </div>
            <div style={{ marginTop: '14px', display: 'grid', gap: '10px' }}>
              <p>
                <strong>Họ tên:</strong> {appDetail.profileCvSnapshot.fullName || '—'}
              </p>
              <p>
                <strong>Email:</strong> {appDetail.profileCvSnapshot.email || '—'}
              </p>
              <p>
                <strong>SĐT:</strong> {appDetail.profileCvSnapshot.phone || '—'}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {appDetail.profileCvSnapshot.address || '—'}
              </p>
              <p>
                <strong>Giới thiệu:</strong> {appDetail.profileCvSnapshot.summary || '—'}
              </p>
              <p>
                <strong>Kỹ năng:</strong>{' '}
                {Array.isArray(appDetail.profileCvSnapshot.skills) &&
                appDetail.profileCvSnapshot.skills.length
                  ? appDetail.profileCvSnapshot.skills.join(', ')
                  : '—'}
              </p>
              <div>
                <strong>Kinh nghiệm:</strong>
                {Array.isArray(appDetail.profileCvSnapshot.experiences) &&
                appDetail.profileCvSnapshot.experiences.length ? (
                  <ul style={{ marginTop: '6px', paddingLeft: '18px' }}>
                    {appDetail.profileCvSnapshot.experiences.map((exp, idx) => {
                      const item = exp as Record<string, unknown>
                      return (
                        <li key={`exp-${idx}`}>
                          {(item.title as string) || 'Vị trí'} - {(item.company as string) || 'Công ty'}
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p style={{ marginTop: '6px' }}>—</p>
                )}
              </div>
              <div>
                <strong>Học vấn:</strong>
                {Array.isArray(appDetail.profileCvSnapshot.educations) &&
                appDetail.profileCvSnapshot.educations.length ? (
                  <ul style={{ marginTop: '6px', paddingLeft: '18px' }}>
                    {appDetail.profileCvSnapshot.educations.map((edu, idx) => {
                      const item = edu as Record<string, unknown>
                      return (
                        <li key={`edu-${idx}`}>
                          {(item.title as string) || 'Chuyên ngành'} - {(item.school as string) || 'Trường học'}
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p style={{ marginTop: '6px' }}>—</p>
                )}
              </div>
              <div>
                <strong>Dự án:</strong>
                {Array.isArray(appDetail.profileCvSnapshot.projects) &&
                appDetail.profileCvSnapshot.projects.length ? (
                  <ul style={{ marginTop: '6px', paddingLeft: '18px' }}>
                    {appDetail.profileCvSnapshot.projects.map((project, idx) => {
                      const item = project as Record<string, unknown>
                      return <li key={`project-${idx}`}>{(item.name as string) || 'Dự án'}</li>
                    })}
                  </ul>
                ) : (
                  <p style={{ marginTop: '6px' }}>—</p>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
      </div>
    </div>
  )
}

export default RecruiterApplicantCVPage
