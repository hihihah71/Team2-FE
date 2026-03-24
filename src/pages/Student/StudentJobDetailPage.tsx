import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ROUTES } from '../../constants/routes'
import {
  applyToJob,
  getMyApplicationsAndSavedJobs,
  rejectMyApplication,
  acceptOffer,
  acceptInterview,
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
        setCvSource('profile_default')
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
    try {
      setApplying(true)
      const updated = await rejectMyApplication(myApplication._id)
      setMyApplication(updated)
      showToast('success', 'Đã từ chối thành công.')
    } catch (err) {
      showToast('error', 'Không thể từ chối.')
    } finally {
      setApplying(false)
    }
  }

  const handleAcceptOffer = async () => {
    if (!myApplication) return
    try {
      setApplying(true)
      const updated = await acceptOffer(myApplication._id)
      setMyApplication(updated)
      showToast('success', 'Đã chấp nhận offer!')
    } catch (err) {
      showToast('error', 'Không thể chấp nhận offer.')
    } finally {
      setApplying(false)
    }
  }

  const handleAcceptInterview = async () => {
    if (!myApplication) return
    try {
      setApplying(true)
      const updated = await acceptInterview(myApplication._id) 
      setMyApplication(updated)
      showToast('success', 'Đã chấp nhận phỏng vấn!')
    } catch (err) {
      showToast('error', 'Không thể chấp nhận phỏng vấn.')
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
      showToast('error', 'Không thể thực hiện.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page-ui"><div className="page-ui__container"><p className="page-ui__muted">Đang tải...</p></div></div>
  if (!job) {
    return (
      <div className="page-ui">
        <div className="page-ui__container">
          <p className="page-ui__muted">{error || 'Không tìm thấy công việc'}</p>
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
        subtitle={`${job.company} • ${job.location || 'Không rõ địa điểm'}`}
        backTo={ROUTES.STUDENT_JOBS}
        backLabel="Quay lại tìm việc"
      />

      {toast && (
        <div style={{ position: 'fixed', top: '22px', right: '24px', zIndex: 95, borderRadius: '10px', padding: '10px 14px', color: '#f8fafc', fontSize: '13px', fontWeight: 600, background: toast.type === 'success' ? 'rgba(22,163,74,0.95)' : 'rgba(220,38,38,0.95)' }}>
          {toast.message}
        </div>
      )}

      <section className="page-ui__card">
        <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Mô tả công việc</h3>
        <p style={{ color: '#d1d5db', marginTop: '10px', whiteSpace: 'pre-wrap' }}>{job.description || 'Không có mô tả.'}</p>

        {job.requirements && (
          <>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '20px' }}>Yêu cầu ứng viên</h3>
            <p style={{ color: '#d1d5db', marginTop: '10px', whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
          </>
        )}

        <div style={{ marginTop: '14px' }}>
          <p className="page-ui__muted">Trạng thái: <strong style={{ color: '#e2e8f0' }}>{myApplyStatus || 'Chưa nộp CV'}</strong></p>
          {myApplyStatus === 'rejected' && (
            <p className="page-ui__muted" style={{ color: '#fca5a5' }}>{rejectedByStudent ? 'Bạn đã từ chối. Có thể nộp lại.' : 'Đã bị từ chối. Có thể nộp lại.'}</p>
          )}
        </div>

        {/* LỊCH PHỎNG VẤN */}
        {myApplication?.status === 'interview' && myApplication?.interviewDate && (
          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px' }}>
            <p style={{ color: '#60a5fa', fontWeight: 600, margin: 0 }}>📅 Lịch phỏng vấn dự kiến:</p>
            <p style={{ color: '#e2e8f0', fontSize: '15px', marginTop: '4px' }}>
              {new Date(myApplication.interviewDate).toLocaleString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        )}

        {/* NÚT BẤM */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button onClick={handleOpenApplyModal} disabled={applying || !canApply} className="page-ui__btn page-ui__btn--primary">
            {myApplyStatus === 'rejected' ? 'Nộp lại CV' : 'Nộp CV / Ứng tuyển'}
          </button>

          {myApplication?.status === 'interview' && (
            <button onClick={handleAcceptInterview} disabled={applying} className="page-ui__btn page-ui__btn--primary">
              Chấp nhận phỏng vấn
            </button>
          )}

          {myApplication && myApplication.status !== 'rejected' && (
            <>
              {myApplication.status === 'offered' && (
                <button onClick={handleAcceptOffer} disabled={applying} className="page-ui__btn page-ui__btn--primary">Chấp nhận offer</button>
              )}
              <button onClick={handleRejectMyApplication} disabled={applying} className="page-ui__btn page-ui__btn--danger">
                {myApplication.status === 'offered' ? 'Từ chối offer' : 'Từ chối ứng tuyển'}
              </button>
            </>
          )}

          <button onClick={handleToggleSave} disabled={saving} className="page-ui__btn page-ui__btn--secondary">
            {saved ? 'Bỏ lưu' : 'Lưu công việc'}
          </button>
        </div>
      </section>

      {/* MODAL GIỮ NGUYÊN LAYOUT CŨ */}
      {isApplyModalOpen && (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80, padding: '16px' }} onClick={() => setIsApplyModalOpen(false)}>
    <div className="page-ui__card" style={{ width: 'min(1000px, 100%)', maxHeight: '92vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '20px' }}>Xác nhận nộp CV</h3>
        <button className="page-ui__btn page-ui__btn--secondary" onClick={() => setIsApplyModalOpen(false)}>Đóng</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: '24px' }}>
        {/* CỘT TRÁI: CHỌN NGUỒN CV */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Chọn CV ứng tuyển:</label>
          <select 
            className="page-ui__input" 
            value={cvSource} 
            onChange={(e) => setCvSource(e.target.value as any)}
            style={{ marginBottom: '16px' }}
          >
            <option value="profile_default">Sử dụng CV từ Hồ sơ cá nhân</option>
            <option value="uploaded_cv">Sử dụng CV PDF đã tải lên</option>
          </select>

          {cvSource === 'uploaded_cv' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Chọn file PDF đã lưu:</label>
              <select 
                className="page-ui__input" 
                value={selectedCvId} 
                onChange={(e) => setSelectedCvId(e.target.value)}
              >
                <option value="">-- Chọn CV --</option>
                {cvs.map(cv => (
                  <option key={cv._id} value={cv._id}>{cv.name}</option>
                ))}
              </select>
            </div>
          )}

          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Thư giới thiệu (Cover Letter):</label>
          <textarea 
            className="page-ui__input" 
            rows={6} 
            placeholder="Giới thiệu ngắn gọn về bản thân..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </div>

        {/* CỘT PHẢI: PREVIEW CV */}
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '12px', border: '1px solid #334155' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 600 }}>Xem trước CV sẽ gửi:</p>
          <div style={{ height: '400px', background: '#1e293b', borderRadius: '4px' }}>
            {cvSource === 'profile_default' ? (
              profilePdfPreviewUrl ? (
                <iframe src={profilePdfPreviewUrl} width="100%" height="100%" style={{ border: 'none' }} title="Profile Preview" />
              ) : <p className="page-ui__muted" style={{ padding: '20px' }}>Đang tạo bản xem trước hồ sơ...</p>
            ) : (
              selectedUploadedCv?.fileUrl ? (
                <iframe src={selectedUploadedCv.fileUrl} width="100%" height="100%" style={{ border: 'none' }} title="CV Preview" />
              ) : <p className="page-ui__muted" style={{ padding: '20px' }}>Vui lòng chọn một file CV để xem trước.</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
        <button className="page-ui__btn page-ui__btn--secondary" onClick={() => setIsApplyModalOpen(false)}>Hủy</button>
        <button onClick={handleConfirmApply} disabled={applying} className="page-ui__btn page-ui__btn--primary">
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