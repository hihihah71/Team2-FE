// Xem chi tiết CV của ứng viên đã apply vào bài đăng
import { useParams, Link } from 'react-router-dom'

const RecruiterApplicantCVPage = () => {
  const { jobId, applicantId } = useParams<{ jobId: string; applicantId: string }>()
  const backUrl = `/recruiter/jobs/${jobId}`

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
        to={backUrl}
        style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px', display: 'inline-block' }}
      >
        ← Quay lại danh sách ứng viên
      </Link>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>
          CV ứng viên #{applicantId}
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Bài đăng #{jobId} — Xem chi tiết CV, thông tin liên hệ, trạng thái shortlist / mời phỏng vấn.
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
          Nội dung: PDF/view CV, tên, email, SĐT, học vấn, kinh nghiệm, kỹ năng. Nút: Shortlist, Từ chối, Mời phỏng vấn.
        </p>
      </section>
    </div>
  )
}

export default RecruiterApplicantCVPage
