// Chi tiết thống kê từng bài đăng của nhà tuyển dụng
import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const RecruiterJobStatsPage = () => {
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
        to={ROUTES.RECRUITER_JOBS}
        style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px', display: 'inline-block' }}
      >
        ← Quay lại quản lý tin
      </Link>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>
          Thống kê bài đăng #{jobId}
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Số lượt xem, số CV đã apply, tỷ lệ shortlist, nguồn ứng viên...
        </p>
      </header>
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {['Lượt xem', 'Số CV đã nộp', 'Đã shortlist', 'Đã mời phỏng vấn'].map((label) => (
          <div
            key={label}
            style={{
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(55,65,81,1)',
            }}
          >
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>{label}</p>
            <p style={{ fontSize: '22px', fontWeight: 700 }}>—</p>
          </div>
        ))}
      </section>
      <p>
        <Link
          to={ROUTES.RECRUITER_JOB_DETAIL.replace(':jobId', jobId || '')}
          style={{ color: '#60a5fa' }}
        >
          Xem danh sách ứng viên →
        </Link>
      </p>
    </div>
  )
}

export default RecruiterJobStatsPage
