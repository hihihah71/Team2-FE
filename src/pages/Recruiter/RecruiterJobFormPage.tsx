import { useParams, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useEffect, useState } from 'react'
import { createJob, getJobById, updateJob, deleteJob } from '../../features/jobs/jobsService'
import { getMyProfile } from '../../features/profile/profileService'
import { useAuth } from '../../contexts/AuthContext'
import { PageHeader } from '../../components/common/PageHeader'
import { StatusBadge } from '../../components/common/StatusBadge'
import { TagFilter } from '../../components/common/TagFilter'
import type { JobItem } from '../../types/domain'
import { validateText } from '../../utils/inputValidation'
import '../PageUI.css'

type ToastState = { type: 'success' | 'error'; message: string } | null

const RecruiterJobFormPage = () => {
  const { user } = useAuth()
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const isEdit = jobId && jobId !== 'new'

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
    skills: '',
    phone: '',
    imageUrl: '',
    tags: [] as string[],
  })
  const [jobMeta, setJobMeta] = useState<JobItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    window.setTimeout(() => setToast((prev) => (prev?.message === message ? null : prev)), 2800)
  }

  const formatNumberWithCommas = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (!digits) return ''
    return Number(digits).toLocaleString('en-US')
  }

  const parseFormattedNumber = (value: string) => {
    const digits = value.replace(/\D/g, '')
    return digits ? Number(digits) : null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    if (id === 'salaryMin' || id === 'salaryMax') {
      const nextData = { ...formData, [id]: formatNumberWithCommas(value) }
      setFormData(nextData)

      const nextMin = parseFormattedNumber(nextData.salaryMin)
      const nextMax = parseFormattedNumber(nextData.salaryMax)
      if (nextMin != null && nextMax != null && nextMin > nextMax) {
        setError('Mức lương tối thiểu không được cao hơn mức lương tối đa.')
      } else if (error === 'Mức lương tối thiểu không được cao hơn mức lương tối đa.') {
        setError(null)
      }
      return
    }
    setFormData({ ...formData, [id]: value })
  }

  useEffect(() => {
    if (!isEdit || !jobId) return
    setLoading(true)
    getJobById(jobId)
      .then((job) => {
        setJobMeta(job)
        setFormData({
          title: job.title ?? '',
          company: job.company ?? '',
          location: job.location ?? '',
          description: job.description ?? '',
          requirements: job.requirements ?? '',
          salaryMin: job.salaryMin != null ? formatNumberWithCommas(String(job.salaryMin)) : '',
          salaryMax: job.salaryMax != null ? formatNumberWithCommas(String(job.salaryMax)) : '',
          skills: ((job as { skills?: string[] }).skills || []).join(', '),
          phone: job.phone ?? '',
          imageUrl: job.imageUrl ?? '',
          tags: job.tags ?? [],
        })
      })
      .catch(() => showToast('error', 'Không thể tải dữ liệu bài đăng.'))
      .finally(() => setLoading(false))
  }, [isEdit, jobId])

  useEffect(() => {
    if (isEdit) return
    let cancelled = false
    getMyProfile()
      .then((profile) => {
        if (cancelled || !profile) return
        const companyInfo = (profile as { companyInfo?: Record<string, string> }).companyInfo || {}
        const personalInfo = (profile as { personalInfo?: Record<string, string> }).personalInfo || {}
        setFormData((prev) => ({
          ...prev,
          company: prev.company || companyInfo.companyName || '',
          location: prev.location || companyInfo.address || '',
          phone: prev.phone || personalInfo.phone || '',
        }))
      })
      .catch(() => undefined)
    return () => { cancelled = true }
  }, [isEdit])

  const handleSubmit = async () => {
    if (!isEdit && !user?.isVerifiedRecruiter) {
      setError('Tai khoan recruiter cua ban dang cho admin duyet. Chua the dang tin.')
      return
    }
    const titleError = validateText(formData.title, {
      required: true,
      minLength: 5,
      maxLength: 100,
      maxWords: 12,
      maxWordLength: 20,
      emptyMessage: 'Vui lòng nhập tiêu đề công việc.',
    })
    if (titleError) {
      setError(`Tieu de cong viec: ${titleError}`)
      return
    }

    const companyError = validateText(formData.company, {
      required: true,
      maxLength: 100,
      maxWords: 10,
      maxWordLength: 20,
      emptyMessage: 'Vui lòng nhập tên công ty.',
    })
    if (companyError) {
      setError(`Cong ty: ${companyError}`)
      return
    }

    const locationError = validateText(formData.location, {
      maxLength: 150,
      maxWords: 15,
      maxWordLength: 20,
    })
    if (locationError) {
      setError(`Dia diem: ${locationError}`)
      return
    }

    const descriptionError = validateText(formData.description, {
      maxLength: 5000,
      maxWords: 300,
      maxWordLength: 20,
    })
    if (descriptionError) {
      setError(`Mo ta cong viec: ${descriptionError}`)
      return
    }

    const requirementsError = validateText(formData.requirements, {
      maxLength: 5000,
      maxWords: 300,
      maxWordLength: 20,
    })
    if (requirementsError) {
      setError(`Yeu cau ung vien: ${requirementsError}`)
      return
    }

    const skillsError = validateText(formData.skills, {
      maxLength: 200,
      maxWords: 40,
      maxWordLength: 20,
    })
    if (skillsError) {
      setError(`Ky nang: ${skillsError}`)
      return
    }

    if (formData.phone.trim() && !/^[0-9+\-\s()]{8,15}$/.test(formData.phone.trim())) {
      setError('So dien thoai khong hop le.')
      return
    }

    if (formData.imageUrl.trim()) {
      const imageUrlError = validateText(formData.imageUrl, {
        maxLength: 500,
        maxWords: 1,
        maxWordLength: 500,
      })
      if (imageUrlError) {
        setError(`Image URL: ${imageUrlError}`)
        return
      }
      try {
        new URL(formData.imageUrl.trim())
      } catch {
        setError('Image URL khong hop le.')
        return
      }
    }

    const sMin = parseFormattedNumber(formData.salaryMin)
    const sMax = parseFormattedNumber(formData.salaryMax)

    if (sMin != null && sMax != null && sMin > sMax) {
      setError('Mức lương tối thiểu không được cao hơn mức lương tối đa.')
      return
    }

    setError(null)
    setSaving(true)
    try {
      const payload = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        description: formData.description,
        requirements: formData.requirements,
        salaryMin: parseFormattedNumber(formData.salaryMin),
        salaryMax: parseFormattedNumber(formData.salaryMax),
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        phone: formData.phone,
        imageUrl: formData.imageUrl,
        tags: formData.tags,
      }

      if (isEdit && jobId) {
        const updated = await updateJob(jobId, payload)
        setJobMeta((prev) => (prev ? { ...prev, ...updated } : prev))
        showToast('success', 'Cập nhật tin thành công!')
      } else {
        await createJob(payload)
        showToast('success', 'Đăng tin thành công!')
        setTimeout(() => navigate(ROUTES.RECRUITER_JOBS), 600)
      }
    } catch {
      showToast('error', isEdit ? 'Cập nhật tin thất bại.' : 'Đăng tin thất bại.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!jobId || !jobMeta) return
    const nextStatus = jobMeta.status === 'open' ? 'closed' : 'open'
    try {
      const updated = await updateJob(jobId, { status: nextStatus })
      setJobMeta((prev) => (prev ? { ...prev, status: updated.status || nextStatus } : prev))
      showToast('success', nextStatus === 'open' ? 'Đã mở lại tin tuyển dụng.' : 'Đã đóng tin tuyển dụng.')
    } catch {
      showToast('error', 'Không thể cập nhật trạng thái.')
    }
  }

  const handleDelete = async () => {
    if (!jobId) return
    if (!window.confirm('Bạn chắc chắn muốn xoá tin tuyển dụng này? Hành động này không thể hoàn tác.')) return
    try {
      await deleteJob(jobId)
      showToast('success', 'Đã xoá tin tuyển dụng.')
      setTimeout(() => navigate(ROUTES.RECRUITER_JOBS), 600)
    } catch {
      showToast('error', 'Không thể xoá tin tuyển dụng.')
    }
  }

  if (loading) {
    return (
      <div className="page-ui">
        <div className="page-ui__container" style={{ maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
          <p className="page-ui__muted">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-ui">
      <div className="page-ui__container" style={{ maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
        {toast && (
          <div
            style={{
              position: 'fixed',
              top: '22px',
              right: '24px',
              zIndex: 95,
              borderRadius: '10px',
              padding: '10px 16px',
              color: '#f8fafc',
              fontSize: '13px',
              fontWeight: 600,
              border: toast.type === 'success' ? '1px solid rgba(34,197,94,0.45)' : '1px solid rgba(239,68,68,0.45)',
              background: toast.type === 'success' ? 'rgba(22,163,74,0.95)' : 'rgba(220,38,38,0.95)',
              boxShadow: '0 10px 24px rgba(2,6,23,0.45)',
            }}
          >
            {toast.message}
          </div>
        )}

        <PageHeader
          title={isEdit ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng mới'}
          subtitle={isEdit ? 'Cập nhật thông tin, thay đổi trạng thái hoặc xoá tin.' : 'Điền thông tin để đăng tin tuyển dụng mới lên nền tảng.'}
          backTo={ROUTES.RECRUITER_JOBS}
          backLabel="Quay lại quản lý tin"
        />

        {isEdit && jobMeta && (
          <section
            className="page-ui__card"
            style={{
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="page-ui__muted" style={{ fontSize: '13px' }}>Trạng thái hiện tại:</span>
              <StatusBadge status={jobMeta.status || 'draft'} />
              <span className="page-ui__muted" style={{ fontSize: '12px' }}>
                · {(jobMeta.detailViewCount ?? 0).toLocaleString('vi-VN')} lượt xem
              </span>
              {jobMeta.createdAt && (
                <span className="page-ui__muted" style={{ fontSize: '12px' }}>
                  · Đăng {new Date(jobMeta.createdAt).toLocaleDateString('vi-VN')}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleToggleStatus}
                className={`page-ui__btn ${jobMeta.status === 'open' ? 'page-ui__btn--warning' : 'page-ui__btn--success'}`}
                style={{ fontSize: '12px', padding: '8px 14px' }}
              >
                {jobMeta.status === 'open' ? 'Đóng tin tuyển dụng' : 'Mở lại tin tuyển dụng'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="page-ui__btn page-ui__btn--danger"
                style={{ fontSize: '12px', padding: '8px 14px' }}
              >
                Xoá tin vĩnh viễn
              </button>
            </div>
          </section>
        )}

        {error && <p className="page-ui__error">{error}</p>}
        {!isEdit && (
          <section className="page-ui__card" style={{ marginBottom: '16px' }}>
            <p className="page-ui__muted" style={{ margin: 0 }}>
              Trang thai xac minh recruiter:{' '}
              <strong style={{ color: user?.isVerifiedRecruiter ? '#86efac' : '#fca5a5' }}>
                {user?.isVerifiedRecruiter ? 'Verified' : 'Pending/Rejected'}
              </strong>
            </p>
          </section>
        )}

        <section className="page-ui__card" style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#e2e8f0' }}>Thông tin cơ bản</h3>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div>
              <label htmlFor="title" className="page-ui__label">Tiêu đề công việc *</label>
              <input id="title" value={formData.title} onChange={handleChange} className="page-ui__input" placeholder="VD: Frontend Developer (React)" maxLength={100} />
            </div>
            <div className="page-ui__form-grid">
              <div>
                <label htmlFor="company" className="page-ui__label">Công ty *</label>
                <input id="company" value={formData.company} onChange={handleChange} className="page-ui__input" maxLength={100} />
              </div>
              <div>
                <label htmlFor="location" className="page-ui__label">Địa điểm</label>
                <input id="location" value={formData.location} onChange={handleChange} className="page-ui__input" placeholder="VD: Hà Nội, Remote" maxLength={150} />
              </div>
            </div>
            <div className="page-ui__form-grid">
              <div>
                <label htmlFor="phone" className="page-ui__label">Số điện thoại liên hệ</label>
                <input id="phone" value={formData.phone} onChange={handleChange} className="page-ui__input" maxLength={15} />
              </div>
              <div>
                <label htmlFor="skills" className="page-ui__label">Kỹ năng yêu cầu</label>
                <input id="skills" value={formData.skills} onChange={handleChange} className="page-ui__input" placeholder="React, TypeScript, Node.js" maxLength={200} />
              </div>
            </div>
            <div>
              <label className="page-ui__label">Tags</label>
              <TagFilter
                selected={formData.tags}
                onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
              />
            </div>
          </div>
        </section>

        <section className="page-ui__card" style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#e2e8f0' }}>Mức lương & Hình ảnh</h3>
          <div className="page-ui__form-grid">
            <div>
              <label htmlFor="salaryMin" className="page-ui__label">Lương tối thiểu / tháng</label>
              <input
                id="salaryMin"
                type="text"
                inputMode="numeric"
                value={formData.salaryMin}
                onChange={handleChange}
                className="page-ui__input"
                placeholder="VD: 15,000,000"
                maxLength={15}
              />
            </div>
            <div>
              <label htmlFor="salaryMax" className="page-ui__label">Lương tối đa / tháng</label>
              <input
                id="salaryMax"
                type="text"
                inputMode="numeric"
                value={formData.salaryMax}
                onChange={handleChange}
                className="page-ui__input"
                placeholder="VD: 25,000,000"
                maxLength={15}
              />
            </div>
          </div>
          <div style={{ marginTop: '14px' }}>
            <label htmlFor="imageUrl" className="page-ui__label">Link ảnh đại diện (tuỳ chọn)</label>
            <input id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="page-ui__input" placeholder="https://..." maxLength={500} />
          </div>
          {formData.imageUrl && (
            <div style={{ marginTop: '12px' }}>
              <img
                src={formData.imageUrl}
                alt="Preview"
                style={{
                  maxWidth: '260px',
                  height: '140px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: '1px solid rgba(51, 65, 85, 0.4)',
                }}
              />
            </div>
          )}
        </section>

        <section className="page-ui__card" style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#e2e8f0' }}>Mô tả chi tiết</h3>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div>
              <label htmlFor="description" className="page-ui__label">Mô tả công việc</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="page-ui__textarea"
                placeholder="Mô tả nhiệm vụ, môi trường làm việc, quyền lợi..."
                maxLength={5000}
              />
            </div>
            <div>
              <label htmlFor="requirements" className="page-ui__label">Yêu cầu ứng viên</label>
              <textarea
                id="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="page-ui__textarea"
                placeholder="Kinh nghiệm, bằng cấp, kỹ năng mềm..."
                maxLength={5000}
              />
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate(ROUTES.RECRUITER_JOBS)}
            className="page-ui__btn page-ui__btn--secondary"
          >
            Huỷ bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="page-ui__btn page-ui__btn--success"
            style={{ minWidth: '160px' }}
          >
            {saving ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Đăng tin ngay'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecruiterJobFormPage
