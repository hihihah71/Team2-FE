// Chi tiết một bài đăng của nhà tuyển dụng (dành cho người xin việc)
import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const StudentJobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>()

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
        to={ROUTES.STUDENT_JOBS}
        style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px', display: 'inline-block' }}
      >
        ← Quay lại tìm việc
      </Link>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>
          Chi tiết bài đăng #{jobId}
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Thông tin vị trí tuyển dụng, yêu cầu, kinh nghiệm, địa điểm...
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
          (Nội dung: tên công ty, vị trí, mô tả, yêu cầu kinh nghiệm, kỹ năng, địa điểm, mức lương, form nộp CV...)
        </p>
        <button
          type="button"
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(59,130,246,1), rgba(129,140,248,1))',
            color: '#fff',
            fontWeight: 600,
            border: 'none',
          }}
        >
          Nộp CV / Ứng tuyển
        </button>
      </section>
    </div>
  )
}

export default StudentJobDetailPage
