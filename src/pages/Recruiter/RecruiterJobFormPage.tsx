import { useParams, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useEffect, useState } from 'react'
import { createJob, getJobById, updateJob } from '../../features/jobs/jobsService'
import { getMyProfile } from '../../features/profile/profileService'
import { PageHeader } from '../../components/common/PageHeader'
import '../PageUI.css'

const RecruiterJobFormPage = () => {
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
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setFormData({ ...formData, [id]: formatNumberWithCommas(value) })
      return
    }
    setFormData({ ...formData, [id]: value })
  }

  useEffect(() => {
    const fetchJob = async () => {
      if (!isEdit || !jobId) return
      setLoading(true)
      try {
        const job = await getJobById(jobId)
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
        })
      } catch (err) {
        console.error(err)
        alert('Không thể tải dữ liệu bài đăng.')
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [isEdit, jobId])

  useEffect(() => {
    if (isEdit) return

    let cancelled = false
    getMyProfile()
      .then((profile) => {
        if (cancelled || !profile) return

        const companyInfo = (profile as { companyInfo?: Record<string, string> }).companyInfo || {}
        const personalInfo = (profile as { personalInfo?: Record<string, string> }).personalInfo || {}

        const defaultCompany = companyInfo.companyName || ''
        const defaultLocation = companyInfo.address || ''
        const defaultPhone = personalInfo.phone || ''

        setFormData((prev) => ({
          ...prev,
          company: prev.company || defaultCompany,
          location: prev.location || defaultLocation,
          phone: prev.phone || defaultPhone,
        }))
      })
      .catch((err) => {
        console.error('Không thể lấy profile để điền mặc định form job:', err)
      })

    return () => {
      cancelled = true
    }
  }, [isEdit])

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.company.trim() || !formData.location.trim()) {
      setError('Vui lòng nhập tiêu đề, công ty và địa điểm.')
      return
    }
    setError(null)
    try {
      const salaryMin = parseFormattedNumber(formData.salaryMin)
      const salaryMax = parseFormattedNumber(formData.salaryMax)
      const payload = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        description: formData.description,
        requirements: formData.requirements,
        salaryMin,
        salaryMax,
        skills: formData.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
        phone: formData.phone,
        imageUrl: formData.imageUrl,
      }

      if (isEdit && jobId) {
        await updateJob(jobId, payload)
        alert('Cập nhật tin thành công!')
      } else {
        await createJob(payload)
        alert('Đăng tin thành công!')
      }

      navigate(ROUTES.RECRUITER_JOBS)
    } catch (err) {
      console.error(err)
      alert(isEdit ? 'Cập nhật tin thất bại' : 'Đăng tin thất bại')
    }
  }

  return (
    <div className="page-ui">
      <div className="page-ui__container" style={{ maxWidth: '860px' }}>
        <PageHeader
          title={isEdit ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng mới'}
          subtitle="Biểu mẫu nâng cao gồm lương min/max, kỹ năng, yêu cầu công việc."
          backTo={ROUTES.RECRUITER_JOBS}
          backLabel="Quay lại quản lý tin tuyển dụng"
        />

        <section className="page-ui__card">
          <form className="page-ui__form">
            {error && <p className="page-ui__error">{error}</p>}
            <div>
              <label htmlFor="title" className="page-ui__label">Tiêu đề công việc</label>
              <input id="title" value={formData.title} onChange={handleChange} className="page-ui__input" />
            </div>

            <div className="page-ui__form-grid">
              <div>
                <label htmlFor="company" className="page-ui__label">Công ty</label>
                <input id="company" value={formData.company} onChange={handleChange} className="page-ui__input" />
              </div>
              <div>
                <label htmlFor="phone" className="page-ui__label">Số điện thoại</label>
                <input id="phone" value={formData.phone} onChange={handleChange} className="page-ui__input" />
              </div>
            </div>

            <div className="page-ui__form-grid">
              <div>
                <label htmlFor="location" className="page-ui__label">Địa điểm</label>
                <input id="location" value={formData.location} onChange={handleChange} className="page-ui__input" />
              </div>
              <div>
                <label htmlFor="salaryMin" className="page-ui__label">Lương / tháng</label>
                <input
                  id="salaryMin"
                  type="text"
                  inputMode="numeric"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className="page-ui__input"
                  placeholder="Ví dụ: 15,000,000"
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
                  placeholder="Ví dụ: 25,000,000"
                />
              </div>
            </div>

            <div className="page-ui__form-grid">
              <div>
                <label htmlFor="imageUrl" className="page-ui__label">Link ảnh</label>
                <input id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="page-ui__input" />
              </div>
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Job preview"
                  style={{ width: 220, height: 120, objectFit: 'cover', borderRadius: 10, border: '1px solid #334155' }}
                />
              )}
            </div>

            <div>
              <label htmlFor="description" className="page-ui__label">Mô tả công việc</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="page-ui__textarea"
              />
            </div>
            <div>
              <label htmlFor="requirements" className="page-ui__label">Yêu cầu ứng viên</label>
              <textarea
                id="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="page-ui__textarea"
              />
            </div>
            <div>
              <label htmlFor="skills" className="page-ui__label">Kỹ năng (phân cách bằng dấu phẩy)</label>
              <input
                id="skills"
                value={formData.skills}
                onChange={handleChange}
                className="page-ui__input"
                placeholder="React, TypeScript, Node.js"
              />
            </div>

            <button type="button" onClick={handleSubmit} className="page-ui__btn page-ui__btn--success">
              {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật bài viết' : 'Đăng tin ngay'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default RecruiterJobFormPage