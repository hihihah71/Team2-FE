// Trang homepage cho phép chọn loại người dùng (sinh viên / nhà tuyển dụng)
import { useState } from 'react'
import TopNavbar from '../../components/layout/TopNavbar'
import UserTypeCard from '../../components/home/UserTypeCard'
import AuthModal from '../../components/auth/AuthModal'

type AuthMode = 'login' | 'register' | null

const HomePage = () => {
  const [authMode, setAuthMode] = useState<AuthMode>(null)

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
        <TopNavbar
          onOpenLogin={() => setAuthMode('login')}
          onOpenRegister={() => setAuthMode('register')}
        />

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
          <UserTypeCard
            title="Tôi là sinh viên"
            description="Tạo hồ sơ cá nhân, upload nhiều phiên bản CV và nộp vào các vị trí phù hợp."
            bullets={[
              'Quản lý danh sách CV của bạn',
              'Theo dõi trạng thái từng lượt ứng tuyển',
              'Gợi ý công việc theo ngành học',
            ]}
            buttonText="Đăng nhập dành cho sinh viên"
            onButtonClick={() => setAuthMode('login')}
            variant="student"
          />

          <UserTypeCard
            title="Tôi là nhà tuyển dụng"
            description="Tạo tin tuyển dụng, xem nhanh các CV phù hợp và lọc ứng viên theo tiêu chí của bạn."
            bullets={[
              'Quản lý tin tuyển dụng theo từng vị trí',
              'Xem danh sách CV đã apply theo job',
              'Đánh dấu shortlist, từ chối, mời phỏng vấn',
            ]}
            buttonText="Đăng nhập dành cho nhà tuyển dụng"
            onButtonClick={() => setAuthMode('login')}
            variant="recruiter"
          />
        </div>
      </div>
      {authMode && (
        <AuthModal
          mode={authMode === 'login' ? 'login' : 'register'}
          onClose={() => setAuthMode(null)}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </div>
  )
}

export default HomePage

// Trang quản lý homepage sau khi login (Cho người dùng chọn làm nhà tuyển dụng / người đi xin việc)