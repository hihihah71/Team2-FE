// Dashboard của nhà tuyển dụng
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { getRecruiterDashboardStats } from '../../features/dashboard/dashboardService'
import type { RecruiterDashboardStats } from '../../types/domain'
import { PageHeader } from '../../components/common/PageHeader'
import { StatsCard } from '../../components/dashboard/StatsCard'
import './RecruiterDashboardPage.css'
import '../PageUI.css'

const RecruiterDashboardPage = () => {
  const [stats, setStats] = useState<RecruiterDashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getRecruiterDashboardStats()
        setStats(data)
      } catch (err: unknown) {
        console.error('Failed to fetch recruiter dashboard stats:', err)
        const message = err instanceof Error ? err.message : 'Không thể tải thống kê.'
        setError(message)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="page-ui">
      <div className="page-ui__container">
        <PageHeader
          title="Xin chào, nhà tuyển dụng 👋"
          subtitle="Theo dõi hiệu suất tuyển dụng và xử lý ứng viên nhanh hơn."
        />

        {error && (
          <p className="page-ui__error">{error}</p>
        )}

        <section className="page-ui__kpi-grid">
          <StatsCard label="Tổng số tin" value={stats ? stats.totalJobs : '—'} accent="blue" />
          <StatsCard label="Tin đang mở" value={stats ? stats.openJobs : '—'} accent="green" />
          <StatsCard
            label="Tổng số đơn ứng tuyển"
            value={stats ? stats.totalApplications : '—'}
            accent="purple"
          />
          <StatsCard label="Đơn mới hôm nay" value={stats ? stats.todayApplications : '—'} accent="green" />
        </section>

        <section className="page-ui__card">
          <h2 style={{ marginTop: 0 }}>Lối tắt tuyển dụng</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to={ROUTES.RECRUITER_JOBS} className="page-ui__button page-ui__button--primary">
              Quản lý tin tuyển dụng
            </Link>
            <Link to={ROUTES.RECRUITER_JOB_CREATE} className="page-ui__button page-ui__button--secondary">
              Đăng tin mới
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default RecruiterDashboardPage
