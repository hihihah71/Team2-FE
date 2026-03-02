// Màn hình tổng quan của người đi xin việc
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const StudentDashboardPage = () => {
  // Dữ liệu mock tạm thời, sau có thể thay bằng API thật
  const stats = {
    totalCvs: 3,
    activeCv: 'CV_Frontend_Intern.pdf',
    appliedJobs: 5,
    interviews: 1,
  }

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
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '6px',
          }}
        >
          Xin chào, sinh viên 👋
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Đây là màn hình tổng quan CV và các đơn ứng tuyển của bạn.
        </p>
      </header>

      <p style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link to={ROUTES.STUDENT_JOBS} style={{ color: '#60a5fa' }}>Tìm việc</Link>
        <Link to={ROUTES.STUDENT_MY_JOBS} style={{ color: '#60a5fa' }}>Đơn đã apply & đã lưu</Link>
        <Link to={ROUTES.STUDENT_CV} style={{ color: '#60a5fa' }}>Quản lý CV</Link>
        <Link to={ROUTES.STUDENT_PROFILE} style={{ color: '#60a5fa' }}>Thông tin cá nhân</Link>
      </p>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            borderRadius: '12px',
            padding: '16px',
            background:
              'radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent), #020617',
            border: '1px solid rgba(59,130,246,0.45)',
          }}
        >
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>
            Tổng số CV
          </p>
          <p style={{ fontSize: '26px', fontWeight: 700 }}>{stats.totalCvs}</p>
        </div>

        <div
          style={{
            borderRadius: '12px',
            padding: '16px',
            background:
              'radial-gradient(circle at top right, rgba(52,211,153,0.18), transparent), #020617',
            border: '1px solid rgba(34,197,94,0.45)',
          }}
        >
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>
            CV đang sử dụng
          </p>
          <p style={{ fontSize: '15px', fontWeight: 600 }}>{stats.activeCv}</p>
        </div>

        <div
          style={{
            borderRadius: '12px',
            padding: '16px',
            background:
              'radial-gradient(circle at bottom, rgba(251,191,36,0.18), transparent), #020617',
            border: '1px solid rgba(245,158,11,0.5)',
          }}
        >
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>
            Số job đã ứng tuyển
          </p>
          <p style={{ fontSize: '26px', fontWeight: 700 }}>{stats.appliedJobs}</p>
        </div>

        <div
          style={{
            borderRadius: '12px',
            padding: '16px',
            background:
              'radial-gradient(circle at bottom right, rgba(129,140,248,0.22), transparent), #020617',
            border: '1px solid rgba(129,140,248,0.5)',
          }}
        >
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>
            Lịch phỏng vấn sắp tới
          </p>
          <p style={{ fontSize: '26px', fontWeight: 700 }}>{stats.interviews}</p>
        </div>
      </section>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 3fr',
          gap: '20px',
        }}
      >
        <div
          style={{
            borderRadius: '12px',
            padding: '16px',
            backgroundColor: '#020617',
            border: '1px solid rgba(55,65,81,1)',
          }}
        >
          <h2
            style={{
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '10px',
            }}
          >
            Hành động nhanh
          </h2>
          <ul
            style={{
              listStyle: 'disc',
              paddingLeft: '18px',
              color: '#9ca3af',
              fontSize: '14px',
              display: 'grid',
              gap: '4px',
            }}
          >
            <li>Upload CV mới cho kỳ thực tập sắp tới</li>
            <li>Cập nhật điểm mạnh, kỹ năng trên CV hiện tại</li>
            <li>Tìm kiếm job phù hợp theo ngành hoặc vị trí mong muốn</li>
          </ul>
        </div>

        <div
          style={{
            borderRadius: '12px',
            padding: '16px',
            backgroundColor: '#020617',
            border: '1px solid rgba(55,65,81,1)',
          }}
        >
          <h2
            style={{
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '10px',
            }}
          >
            Đơn ứng tuyển gần đây
          </h2>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
            }}
          >
            <thead>
              <tr style={{ color: '#9ca3af', textAlign: 'left' }}>
                <th style={{ padding: '6px 4px', borderBottom: '1px solid #374151' }}>
                  Vị trí
                </th>
                <th style={{ padding: '6px 4px', borderBottom: '1px solid #374151' }}>
                  Công ty
                </th>
                <th style={{ padding: '6px 4px', borderBottom: '1px solid #374151' }}>
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '6px 4px' }}>Frontend Intern</td>
                <td style={{ padding: '6px 4px' }}>Rikkeisoft</td>
                <td style={{ padding: '6px 4px', color: '#22c55e' }}>Đang review</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 4px' }}>Java Developer Fresher</td>
                <td style={{ padding: '6px 4px' }}>FPT Software</td>
                <td style={{ padding: '6px 4px', color: '#eab308' }}>Chờ phản hồi</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 4px' }}>Tester Intern</td>
                <td style={{ padding: '6px 4px' }}>VNPT</td>
                <td style={{ padding: '6px 4px', color: '#9ca3af' }}>Đã nộp</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default StudentDashboardPage

// Màn hình tổng quan của người đi xin việc