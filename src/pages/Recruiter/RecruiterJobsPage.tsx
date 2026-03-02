// Quản lý tất cả các bài đăng của nhà tuyển dụng
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const RecruiterJobsPage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#020617',
        color: '#e5e7eb',
        padding: '24px',
      }}
    >
      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>
            Quản lý tin tuyển dụng
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Tất cả bài đăng của bạn. Tạo mới, chỉnh sửa, xem thống kê, xem CV ứng viên.
          </p>
        </div>
        <Link
          to={ROUTES.RECRUITER_JOB_CREATE}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.9), rgba(22,163,74,0.9))',
            color: '#fff',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Đăng tin mới
        </Link>
      </header>
      <section
        style={{
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(55,65,81,1)',
        }}
      >
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Bảng danh sách bài đăng: tiêu đề, trạng thái, số CV, nút Sửa / Thống kê / Xem ứng viên.
        </p>
      </section>
      <p style={{ marginTop: '16px' }}>
        <Link to={ROUTES.RECRUITER_DASHBOARD} style={{ color: '#60a5fa' }}>
          ← Về trang tổng quan
        </Link>
      </p>
    </div>
  )
}

export default RecruiterJobsPage
