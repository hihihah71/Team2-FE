// Trang homepage cho phép chọn loại người dùng (sinh viên / nhà tuyển dụng)
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#e5e7eb',
        padding: '40px 48px',
      }}
    >
      <div
        style={{
          width: '100%',
          backgroundColor: '#020617',
          borderRadius: '16px',
          padding: '0 48px 32px 48px',
          boxShadow: '0 25px 50px -12px rgba(15,23,42,0.9)',
          border: '1px solid rgba(148,163,184,0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 0',
            borderBottom: '1px solid rgba(31,41,55,1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '999px',
                background:
                  'conic-gradient(from 180deg, #4f46e5, #22c55e, #0ea5e9, #4f46e5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 700,
                color: '#0b1120',
              }}
            >
              CV
            </div>
            <div>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  letterSpacing: 0.2,
                }}
              >
                CV Matching Platform
              </span>
              <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>
                Student & Recruiter Portal
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/login"
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                borderRadius: '999px',
                border: '1px solid rgba(75,85,99,1)',
                color: '#e5e7eb',
              }}
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              style={{
                padding: '7px 16px',
                fontSize: '13px',
                borderRadius: '999px',
                background:
                  'linear-gradient(135deg, rgba(59,130,246,1), rgba(129,140,248,1))',
                color: '#f9fafb',
                fontWeight: 600,
              }}
            >
              Đăng ký
            </Link>
          </div>
        </nav>

        <header style={{ marginBottom: '8px' }}>
          <h1
            style={{
              fontSize: '30px',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            Nền tảng quản lý CV cho sinh viên & nhà tuyển dụng
          </h1>
          <p style={{ color: '#9ca3af', maxWidth: '720px', fontSize: '14px' }}>
            Theo dõi toàn bộ vòng đời hồ sơ — từ upload CV, nộp vào từng job cho
            tới khi được shortlist, phỏng vấn và nhận offer — tất cả trong một
            giao diện thống nhất.
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
          }}
        >
          <section
            style={{
              borderRadius: '12px',
              padding: '20px',
              background:
                'radial-gradient(circle at top left, rgba(59,130,246,0.24), transparent), #020617',
              border: '1px solid rgba(59,130,246,0.4)',
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '8px',
              }}
            >
              Tôi là sinh viên
            </h2>
            <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
              Tạo hồ sơ cá nhân, upload nhiều phiên bản CV và nộp vào các vị trí
              phù hợp.
            </p>
            <ul
              style={{
                marginBottom: '16px',
                paddingLeft: '18px',
                color: '#9ca3af',
                fontSize: '14px',
              }}
            >
              <li>Quản lý danh sách CV của bạn</li>
              <li>Theo dõi trạng thái từng lượt ứng tuyển</li>
              <li>Gợi ý công việc theo ngành học</li>
            </ul>
            <Link
              to="/login?role=student"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 18px',
                borderRadius: '999px',
                background:
                  'linear-gradient(135deg, rgba(59,130,246,1), rgba(129,140,248,1))',
                color: '#f9fafb',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Đăng nhập dành cho sinh viên
            </Link>
          </section>

          <section
            style={{
              borderRadius: '12px',
              padding: '20px',
              background:
                'radial-gradient(circle at top right, rgba(16,185,129,0.24), transparent), #020617',
              border: '1px solid rgba(34,197,94,0.4)',
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '8px',
              }}
            >
              Tôi là nhà tuyển dụng
            </h2>
            <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
              Tạo tin tuyển dụng, xem nhanh các CV phù hợp và lọc ứng viên theo
              tiêu chí của bạn.
            </p>
            <ul
              style={{
                marginBottom: '16px',
                paddingLeft: '18px',
                color: '#9ca3af',
                fontSize: '14px',
              }}
            >
              <li>Quản lý tin tuyển dụng theo từng vị trí</li>
              <li>Xem danh sách CV đã apply theo job</li>
              <li>Đánh dấu shortlist, từ chối, mời phỏng vấn</li>
            </ul>
            <Link
              to="/login?role=recruiter"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 18px',
                borderRadius: '999px',
                background:
                  'linear-gradient(135deg, rgba(34,197,94,1), rgba(45,212,191,1))',
                color: '#022c22',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Đăng nhập dành cho nhà tuyển dụng
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}

export default HomePage

// Trang quản lý homepage sau khi login (Cho người dùng chọn làm nhà tuyển dụng / người đi xin việc)