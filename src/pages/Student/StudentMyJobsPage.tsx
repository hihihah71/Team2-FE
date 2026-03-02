// Những bài đăng đã apply hoặc đã đánh dấu (lưu) - Người xin việc
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const StudentMyJobsPage = () => {
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
          Đơn đã ứng tuyển & Đã lưu
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Xem lại các bài đã nộp hồ sơ hoặc đã đánh dấu để theo dõi.
        </p>
      </header>
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        <div
          style={{
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(55,65,81,1)',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
            Đã ứng tuyển
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Danh sách job đã nộp CV, trạng thái (đang review, mời phỏng vấn, từ chối...).
          </p>
        </div>
        <div
          style={{
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(55,65,81,1)',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
            Đã lưu / Đánh dấu
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Các bài đăng đã bookmark để xem sau.
          </p>
        </div>
      </section>
      <p style={{ marginTop: '16px' }}>
        <Link to={ROUTES.STUDENT_DASHBOARD} style={{ color: '#60a5fa' }}>
          ← Về trang tổng quan
        </Link>
      </p>
    </div>
  )
}

export default StudentMyJobsPage
