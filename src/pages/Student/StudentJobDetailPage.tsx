import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ROUTES } from '../../constants/routes'
import {
  applyToJob,
  getMyApplicationsAndSavedJobs,
  rejectMyApplication,
} from '../../features/applications/applicationsService'
import { getMyCVs } from '../../features/cvs/cvsService'
import { getJobById, saveJob, trackJobView, unsaveJob } from '../../features/jobs/jobsService'
import { getMyProfile } from '../../features/profile/profileService'
import { buildProfilePdfBlob } from '../../features/cvs/profilePdf'
import type { ApplicationItem, CvItem, JobItem } from '../../types/domain'
import { PageHeader } from '../../components/common/PageHeader'
import '../PageUI.css'

type ToastState = {
  type: 'success' | 'error'
  message: string
} | null

const StudentJobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>()

  const [job, setJob] = useState<JobItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const [cvs, setCvs] = useState<CvItem[]>([])
  const [myApplication, setMyApplication] = useState<ApplicationItem | null>(null)
  const [selectedCvId, setSelectedCvId] = useState('')
  const [cvSource, setCvSource] = useState<'profile_default' | 'uploaded_cv'>('profile_default')
  const [coverLetter, setCoverLetter] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [profilePdfPreviewUrl, setProfilePdfPreviewUrl] = useState('')
  const [toast, setToast] = useState<ToastState>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return
      setLoading(true)
      setError(null)
      try {
        const [jobData, cvsData, overview] = await Promise.all([
          getJobById(jobId),
          getMyCVs(),
          getMyApplicationsAndSavedJobs(),
        ])
        setJob(jobData)
        setCvs(cvsData)
        const foundApp =
          overview.applications.find((item) => {
            const appliedJobId =
              typeof item.jobId === 'string' ? item.jobId : item.jobId?._id
            return appliedJobId === jobId
          }) || null
        setMyApplication(foundApp)
        const hasSaved = overview.savedJobs.some((savedJob) => savedJob._id === jobId)
        setSaved(hasSaved)
        const defaultCv = cvsData.find((cv) => cv.isDefault)
        setSelectedCvId(defaultCv?._id || cvsData[0]?._id || '')
        setCvSource(cvsData.length > 0 ? 'profile_default' : 'profile_default')
        // Track detail views for recruiter analytics.
        trackJobView(jobId).catch(() => undefined)
      } catch (err: unknown) {
        console.error('Failed to fetch job detail context', err)
        const message = err instanceof Error ? err.message : 'Không thể tải thông tin công việc.'
        setError(message)
        setJob(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [jobId])

  useEffect(() => {
    let active = true
    let generatedUrl = ''
    getMyProfile()
      .then((profile) => {
        if (!active) return
        const blob = buildProfilePdfBlob(profile)
        const previewUrl = URL.createObjectURL(blob)
        generatedUrl = previewUrl
        setProfilePdfPreviewUrl(previewUrl)
      })
      .catch(() => undefined)

    return () => {
      active = false
      if (generatedUrl) URL.revokeObjectURL(generatedUrl)
    }
  }, [])

  const selectedUploadedCv = cvs.find((cv) => cv._id === selectedCvId)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    window.setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev))
    }, 2600)
  }

  const handleConfirmApply = async () => {
    if (!job) return
    if (cvSource === 'uploaded_cv' && !selectedCvId) {
      showToast('error', 'Vui lòng chọn CV PDF trước khi nộp.')
      return
    }
    try {
      setApplying(true)
      await applyToJob({
        jobId: job._id,
        cvSource,
        cvId: cvSource === 'uploaded_cv' ? selectedCvId || undefined : undefined,
        coverLetter: coverLetter.trim() || undefined,
      })
      const refreshed = await getMyApplicationsAndSavedJobs()
      const latestApp =
        refreshed.applications.find((item) => {
          const appliedJobId =
            typeof item.jobId === 'string' ? item.jobId : item.jobId?._id
          return appliedJobId === job._id
        }) || null
      setMyApplication(latestApp)
      showToast(
        'success',
        myApplication?.status === 'rejected'
          ? 'Nộp lại CV thành công!'
          : 'Ứng tuyển thành công!',
      )
      setIsApplyModalOpen(false)
    } catch (err) {
      console.error('Apply failed', err)
      showToast('error', 'Không thể ứng tuyển.')
    } finally {
      setApplying(false)
    }
  }

  const handleOpenApplyModal = () => {
    if (myApplication && myApplication.status !== 'rejected') {
      showToast(
        'error',
        'Bạn đã nộp CV cho bài này rồi. Chỉ có thể nộp lại khi đơn đã bị từ chối.',
      )
      return
    }
    setIsApplyModalOpen(true)
  }

  const handleRejectMyApplication = async () => {
    if (!myApplication) return
    if (!window.confirm('Bạn chắc chắn muốn từ chối đơn ứng tuyển cho công việc này?')) return
    try {
      setApplying(true)
      const updated = await rejectMyApplication(myApplication._id)
      setMyApplication(updated)
      showToast('success', 'Đã từ chối đơn ứng tuyển thành công.')
    } catch (err) {
      console.error(err)
      showToast('error', 'Không thể từ chối đơn ứng tuyển.')
    } finally {
      setApplying(false)
    }
  }

  const handleToggleSave = async () => {
    if (!job) return
    try {
      setSaving(true)
      if (saved) {
        await unsaveJob(job._id)
        setSaved(false)
      } else {
        await saveJob(job._id)
        setSaved(true)
      }
    } catch (err) {
      console.error('Save job failed', err)
      showToast('error', 'Không thể lưu công việc lúc này.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page-ui">
        <div className="page-ui__container">
          <p className="page-ui__muted">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="page-ui">
        <div className="page-ui__container">
          <p className="page-ui__muted">Không tìm thấy công việc</p>
        </div>
      </div>
    )
  }

  const canApply = !myApplication || myApplication.status === 'rejected'
  const myApplyStatus = myApplication?.status
  const rejectedByStudent = myApplication?.status === 'rejected' && myApplication?.rejectedBy === 'student'

  return (
    <div className="page-ui">
      <div className="page-ui__container">
      <PageHeader
        title={job.title}
        subtitle={`${job.company} • ${job.location || 'Không rõ địa điểm'} • ${
          job.salaryMin != null ? `${job.salaryMin.toLocaleString('vi-VN')} VND` : 'Thoả thuận'
        } ${job.salaryMax != null ? `- ${job.salaryMax.toLocaleString('vi-VN')} VND` : ''}`}
        backTo={ROUTES.STUDENT_JOBS}
        backLabel="Quay lại tìm việc"
      />

      {error && (
        <p className="page-ui__error">{error}</p>
      )}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '22px',
            right: '24px',
            zIndex: 95,
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#f8fafc',
            fontSize: '13px',
            fontWeight: 600,
            border:
              toast.type === 'success'
                ? '1px solid rgba(34,197,94,0.45)'
                : '1px solid rgba(239,68,68,0.45)',
            background:
              toast.type === 'success'
                ? 'rgba(22,163,74,0.95)'
                : 'rgba(220,38,38,0.95)',
            boxShadow: '0 10px 24px rgba(2,6,23,0.45)',
          }}
        >
          {toast.message}
        </div>
      )}

      <section className="page-ui__card">
        <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Mô tả công việc</h3>

        <p style={{ color: '#d1d5db', marginTop: '10px', whiteSpace: 'pre-wrap' }}>
          {job.description || 'Không có mô tả.'}
        </p>

        {job.requirements && (
          <>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '20px' }}>
              Yêu cầu ứng viên
            </h3>
            <p style={{ color: '#d1d5db', marginTop: '10px', whiteSpace: 'pre-wrap' }}>
              {job.requirements}
            </p>
          </>
        )}

        <div style={{ marginTop: '14px' }}>
          <p className="page-ui__muted" style={{ margin: 0 }}>
            Trạng thái ứng tuyển của bạn:{' '}
            <strong style={{ color: '#e2e8f0' }}>
              {myApplyStatus ? myApplyStatus : 'Chưa nộp CV'}
            </strong>
          </p>
          <p className="page-ui__muted" style={{ marginTop: '4px' }}>
            Trạng thái lưu tin:{' '}
            <strong style={{ color: saved ? '#86efac' : '#e2e8f0' }}>
              {saved ? 'Đã lưu' : 'Chưa lưu'}
            </strong>
          </p>
          {myApplyStatus && myApplyStatus !== 'rejected' && (
            <p className="page-ui__muted" style={{ marginTop: '4px', color: '#fbbf24' }}>
              Bạn đã nộp CV cho bài này, không thể nộp lại ở thời điểm hiện tại.
            </p>
          )}
          {myApplyStatus === 'rejected' && (
            <p className="page-ui__muted" style={{ marginTop: '4px', color: '#fca5a5' }}>
              {rejectedByStudent
                ? 'Bạn đã từ chối công việc trước đó. Bạn có thể nộp lại.'
                : 'Đơn đã bị từ chối. Bạn có thể nộp lại CV.'}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={handleOpenApplyModal}
            disabled={applying || !canApply}
            className="page-ui__btn page-ui__btn--primary"
          >
            {myApplyStatus === 'rejected' ? 'Nộp lại CV' : 'Nộp CV / Ứng tuyển'}
          </button>
          {myApplication && myApplication.status !== 'rejected' && (
            <button
              onClick={handleRejectMyApplication}
              disabled={applying}
              className="page-ui__btn page-ui__btn--danger"
            >
              {myApplication.status === 'offered' ? 'Từ chối offer' : 'Từ chối ứng tuyển'}
            </button>
          )}
          <button
            onClick={handleToggleSave}
            disabled={saving}
            className="page-ui__btn page-ui__btn--secondary"
          >
            {saving ? 'Đang xử lý...' : saved ? 'Bỏ lưu công việc' : 'Lưu công việc'}
          </button>
        </div>
      </section>
      {isApplyModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 23, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 80,
            padding: '16px',
          }}
          onClick={() => setIsApplyModalOpen(false)}
        >
          <div
            className="page-ui__card"
            style={{ width: 'min(1000px, 100%)', maxHeight: '92vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '20px' }}>Xác nhận nộp CV</h3>
              <button
                type="button"
                className="page-ui__btn page-ui__btn--secondary"
                onClick={() => setIsApplyModalOpen(false)}
              >
                Đóng
              </button>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label className="page-ui__label">Chọn nguồn CV để ứng tuyển</label>
              <div style={{ display: 'grid', gap: '8px' }}>
                <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="cvSource"
                    checked={cvSource === 'profile_default'}
                    onChange={() => setCvSource('profile_default')}
                  />
                  <span>CV mặc định tự động từ Profile</span>
                </label>
                <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="cvSource"
                    checked={cvSource === 'uploaded_cv'}
                    onChange={() => setCvSource('uploaded_cv')}
                    disabled={cvs.length === 0}
                  />
                  <span>Chọn file PDF đã upload</span>
                </label>
              </div>
              {cvSource === 'uploaded_cv' && (
                <select
                  className="page-ui__input"
                  value={selectedCvId}
                  onChange={(event) => setSelectedCvId(event.target.value)}
                  style={{ marginTop: '10px' }}
                >
                  {cvs.length === 0 ? (
                    <option value="">Chưa có CV PDF nào, hãy upload tại trang Quản lý CV</option>
                  ) : (
                    cvs.map((cv) => (
                      <option key={cv._id} value={cv._id}>
                        {cv.name} {cv.isDefault ? '(Mặc định)' : ''}
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>

            <div style={{ marginTop: '12px' }}>
              <label className="page-ui__label">Preview CV trước khi nộp</label>
              {cvSource === 'profile_default' ? (
                profilePdfPreviewUrl ? (
                  <iframe
                    src={profilePdfPreviewUrl}
                    title="Profile CV preview"
                    style={{
                      width: '100%',
                      height: '420px',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                      background: '#0b1220',
                    }}
                  />
                ) : (
                  <p className="page-ui__muted">Đang tạo preview CV từ profile...</p>
                )
              ) : selectedUploadedCv?.fileUrl ? (
                <iframe
                  src={selectedUploadedCv.fileUrl}
                  title="Uploaded CV preview"
                  style={{
                    width: '100%',
                    height: '420px',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    background: '#0b1220',
                  }}
                />
              ) : (
                <p className="page-ui__muted">Vui lòng chọn một CV PDF để xem preview.</p>
              )}
            </div>

            <div style={{ marginTop: '12px' }}>
              <label className="page-ui__label">Thư giới thiệu (tuỳ chọn)</label>
              <textarea
                className="page-ui__textarea"
                value={coverLetter}
                onChange={(event) => setCoverLetter(event.target.value)}
                placeholder="Viết ngắn gọn lý do bạn phù hợp với vị trí này..."
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="page-ui__btn page-ui__btn--secondary"
                onClick={() => setIsApplyModalOpen(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmApply}
                disabled={applying || (cvSource === 'uploaded_cv' && (!cvs.length || !selectedCvId))}
                className="page-ui__btn page-ui__btn--primary"
              >
                {applying ? 'Đang nộp...' : 'Xác nhận nộp CV'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default StudentJobDetailPage