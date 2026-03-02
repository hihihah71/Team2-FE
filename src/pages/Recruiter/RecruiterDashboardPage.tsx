// Dashboard của nhà tuyển dụng
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const RecruiterDashboardPage = () => {
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
          Xin chào, nhà tuyển dụng 👋
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Tổng quan tin tuyển dụng và ứng viên.
        </p>
      </header>
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div style={{ borderRadius: '12px', padding: '16px', border: '1px solid rgba(55,65,81,1)' }}>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>Tổng số tin</p>
          <p style={{ fontSize: '22px', fontWeight: 700 }}>—</p>
        </div>
        <div style={{ borderRadius: '12px', padding: '16px', border: '1px solid rgba(55,65,81,1)' }}>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>CV mới ứng tuyển</p>
          <p style={{ fontSize: '22px', fontWeight: 700 }}>—</p>
        </div>
      </section>
      <p>
        <Link to={ROUTES.RECRUITER_JOBS} style={{ color: '#60a5fa' }}>
          Quản lý tin tuyển dụng →
        </Link>
      </p>
    </div>
  )
}

export default RecruiterDashboardPage
