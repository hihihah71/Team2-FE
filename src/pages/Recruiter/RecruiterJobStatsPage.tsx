import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useEffect, useState } from 'react'

interface StatsData {
  views: number;
  applications: number;
  shortlisted: number;
  interviews: number;
}

const RecruiterJobStatsPage = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("access_token");
        // Update the URL below to match your backend API address
        const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching job stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchStats();
  }, [jobId]);

  const statConfig = [
    { label: 'Lượt xem', value: stats?.views ?? 0 },
    { label: 'Số CV đã nộp', value: stats?.applications ?? 0 },
    { label: 'Đã shortlist', value: stats?.shortlisted ?? 0 },
    { label: 'Đã mời phỏng vấn', value: stats?.interviews ?? 0 },
  ];

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
        {statConfig.map((item) => (
          <div
            key={item.label}
            style={{
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(55,65,81,1)',
              backgroundColor: '#0f172a'
            }}
          >
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>{item.label}</p>
            <p style={{ fontSize: '22px', fontWeight: 700 }}>
              {loading ? '...' : item.value.toLocaleString()}
            </p>
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