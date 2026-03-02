// Upload / Chỉnh sửa bài đăng tuyển dụng (vị trí, yêu cầu, kinh nghiệm, ...)
import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const RecruiterJobFormPage = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const isEdit = jobId && jobId !== 'new'

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#020617',
        color: '#e5e7eb',
        padding: '24px',
      }}
    >
      <Link
        to={ROUTES.RECRUITER_JOBS}
        style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px', display: 'inline-block' }}
      >
        ← Quay lại quản lý tin tuyển dụng
      </Link>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>
          {isEdit ? `Chỉnh sửa bài đăng #${jobId}` : 'Đăng tin tuyển dụng mới'}
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Điền thông tin: vị trí tuyển dụng, mô tả, yêu cầu kinh nghiệm, kỹ năng, địa điểm, mức lương...
        </p>
      </header>
      <section
        style={{
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(55,65,81,1)',
          maxWidth: '720px',
        }}
      >
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Form: Tiêu đề, công ty, vị trí, mô tả, yêu cầu (số năm KN, kỹ năng), địa điểm, lương, hạn nộp...
        </p>
        <button
          type="button"
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.9), rgba(22,163,74,0.9))',
            color: '#fff',
            fontWeight: 600,
            border: 'none',
          }}
        >
          {isEdit ? 'Lưu thay đổi' : 'Đăng tin'}
        </button>
      </section>
    </div>
  )
}

export default RecruiterJobFormPage
