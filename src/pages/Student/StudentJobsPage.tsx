// Trang chính tìm việc — Người xin việc
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const StudentJobsPage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#020617',
        color: '#e5e7eb',
        padding: '24px',
      }}
    >
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>
          Tìm việc
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Duyệt tin tuyển dụng, lọc theo vị trí, kinh nghiệm, công ty. Click vào bài đăng để xem chi tiết và nộp CV.
        </p>
      </header>
      <section
        style={{
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(55,65,81,1)',
        }}
      >
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Danh sách / grid bài đăng, ô tìm kiếm, bộ lọc. Mỗi thẻ link tới <code>/student/jobs/:jobId</code>.
        </p>
      </section>
      <p style={{ marginTop: '16px' }}>
        <Link to={ROUTES.STUDENT_MY_JOBS} style={{ color: '#60a5fa' }}>
          Xem đơn đã apply & đã lưu →
        </Link>
      </p>
    </div>
  )
}

export default StudentJobsPage
