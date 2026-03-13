import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { apiPost } from '../../services/httpClient'
import { useState } from 'react'

const RecruiterJobFormPage = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const isEdit = jobId && jobId !== 'new'

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salaryMin: '',
    phone: '', // New field
    imageUrl: '' // New field (optional)
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      await apiPost('/jobs', { 
        ...formData, 
        salaryMin: Number(formData.salaryMin) 
      })
      alert('Đăng tin thành công!')
    } catch (err) {
      console.error(err)
      alert('Đăng tin thất bại')
    }
  }

  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: '0.2s'
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#94a3b8',
    marginBottom: '6px',
    display: 'block'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f1f5f9', padding: '40px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to={ROUTES.RECRUITER_JOBS} style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>
          ← Quay lại quản lý tin tuyển dụng
        </Link>
        
        <header style={{ margin: '24px 0 32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700 }}>
            {isEdit ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng mới'}
          </h1>
        </header>

        <section style={{ backgroundColor: '#0b1120', borderRadius: '16px', padding: '40px', border: '1px solid #1e293b' }}>
          <form>
            <form>

<div style={{ marginBottom: 20 }}>
  <label htmlFor="title" style={labelStyle}>Tiêu đề công việc</label>
  <input id="title" value={formData.title} onChange={handleChange} style={inputBase}/>
</div>

{/* Company + Phone */}
<div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
  <div style={{ flex: 1 }}>
    <label htmlFor="company" style={labelStyle}>Công ty</label>
    <input id="company" value={formData.company} onChange={handleChange} style={inputBase}/>
  </div>

  <div style={{ flex: 1 }}>
    <label htmlFor="phone" style={labelStyle}>Số điện thoại</label>
    <input id="phone" value={formData.phone} onChange={handleChange} style={inputBase}/>
  </div>
</div>

{/* Location + Salary */}
<div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
  <div style={{ flex: 1 }}>
    <label htmlFor="location" style={labelStyle}>Địa điểm</label>
    <input id="location" value={formData.location} onChange={handleChange} style={inputBase}/>
  </div>

  <div style={{ flex: 1 }}>
    <label htmlFor="salaryMin" style={labelStyle}>Lương / tháng</label>
    <input id="salaryMin" type="number" value={formData.salaryMin} onChange={handleChange} style={inputBase}/>
  </div>
</div>

{/* Image + Preview */}
<div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
  <div style={{ flex: 1 }}>
    <label htmlFor="imageUrl" style={labelStyle}>Link ảnh</label>
    <input id="imageUrl" value={formData.imageUrl} onChange={handleChange} style={inputBase}/>
  </div>

  {formData.imageUrl && (
    <img
      src={formData.imageUrl}
      style={{ width: 160, height: 100, objectFit: "cover", borderRadius: 8 }}
    />
  )}
</div>

{/* Description */}
<div style={{ marginBottom: 20 }}>
  <label htmlFor="description" style={labelStyle}>Mô tả công việc</label>
  <textarea
    id="description"
    value={formData.description}
    onChange={handleChange}
    style={{ ...inputBase, minHeight: 180 }}
  />
</div>

<button
  type="button"
  onClick={handleSubmit}
  style={{
    width: "100%",
    padding: 14,
    borderRadius: 10,
    background: "linear-gradient(135deg,#22c55e,#16a34a)",
    color: "#fff",
    border: "none",
    fontWeight: 600,
    cursor: "pointer"
  }}
>
  {isEdit ? "Cập nhật bài viết" : "Đăng tin ngay"}
</button>

</form>
          </form>
        </section>
      </div>
    </div>
  )
}

export default RecruiterJobFormPage