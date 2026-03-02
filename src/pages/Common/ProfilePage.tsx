// Trang xem / đổi thông tin cá nhân, tài khoản (dùng chung Student & Recruiter)
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const ProfilePage = () => {
  const location = useLocation()
  const isRecruiter = location.pathname.startsWith('/recruiter')

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
          Thông tin cá nhân & Tài khoản
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Xem và chỉnh sửa thông tin cá nhân, đổi mật khẩu, email...
        </p>
      </header>
      <section
        style={{
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(55,65,81,1)',
          maxWidth: '560px',
        }}
      >
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Form: Họ tên, email, số điện thoại, avatar, đổi mật khẩu...
          {isRecruiter ? ' (Nhà tuyển dụng: thêm thông tin công ty.)' : ''}
        </p>
      </section>
      <p style={{ marginTop: '16px' }}>
        <Link
          to={isRecruiter ? ROUTES.RECRUITER_DASHBOARD : ROUTES.STUDENT_DASHBOARD}
          style={{ color: '#60a5fa' }}
        >
          ← Về trang tổng quan
        </Link>
      </p>
    </div>
  )
}

export default ProfilePage
