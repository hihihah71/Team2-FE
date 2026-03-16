import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useEffect, useState } from 'react'
import { getJobById, getJobStats } from '../../features/jobs/jobsService'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { PageHeader } from '../../components/common/PageHeader'
import '../PageUI.css'
import type { JobItem } from '../../types/domain'

interface StatsData {
  total: number
  byStatus: Record<string, number>
  detailViewCount: number
}

const RecruiterJobStatsPage = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [job, setJob] = useState<JobItem | null>(null)
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      if (!jobId) return
      setLoading(true)
      setError(null)
      try {
        const [statsData, jobData] = await Promise.all([getJobStats(jobId), getJobById(jobId)])
        setStats(statsData)
        setJob(jobData)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Không thể tải thống kê job.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [jobId])

  const totalApplications = stats?.total ?? 0
  const shortlisted = stats?.byStatus?.shortlisted ?? 0
  const interviews = stats?.byStatus?.interview ?? 0
  const detailViews = stats?.detailViewCount ?? 0

  const statConfig = [
    { label: 'Lượt xem chi tiết', value: detailViews },
    { label: 'Tổng số đơn ứng tuyển', value: totalApplications },
    { label: 'Đã shortlist', value: shortlisted },
    { label: 'Đã mời phỏng vấn', value: interviews },
  ]
  const chartItems = Object.entries(stats?.byStatus || {}).sort((a, b) => b[1] - a[1])

  return (
    <div className="page-ui">
      <div className="page-ui__container">
      <PageHeader
        title={`Thống kê bài đăng: ${job?.title || `#${jobId}`}`}
        subtitle="Theo dõi funnel ứng viên theo từng trạng thái."
        backTo={ROUTES.RECRUITER_JOBS}
        backLabel="Quay lại quản lý tin"
      />
      {error && (
        <p className="page-ui__error">{error}</p>
      )}
      <section className="page-ui__kpi-grid" style={{ marginBottom: '24px' }}>
        {statConfig.map((item) => (
          <StatsCard
            key={item.label}
            label={item.label}
            value={loading ? '...' : item.value.toLocaleString('vi-VN')}
            accent="blue"
          />
        ))}
      </section>
      <section className="page-ui__card" style={{ marginBottom: '16px' }}>
        <h2 style={{ marginTop: 0 }}>Biểu đồ trạng thái ứng viên</h2>
        {loading ? (
          <p className="page-ui__muted">Đang tải dữ liệu biểu đồ...</p>
        ) : chartItems.length === 0 ? (
          <p className="page-ui__muted">Chưa có dữ liệu trạng thái.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {chartItems.map(([status, count]) => {
              const width = totalApplications > 0 ? Math.max(8, Math.round((count / totalApplications) * 100)) : 0
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ textTransform: 'capitalize' }}>{status}</span>
                    <span>{count}</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '999px', backgroundColor: '#1f2937', overflow: 'hidden' }}>
                    <div style={{ width: `${width}%`, height: '100%', backgroundColor: '#60a5fa' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
      <p>
        <Link to={ROUTES.RECRUITER_JOB_DETAIL.replace(':jobId', jobId || '')} style={{ color: '#60a5fa' }}>
          Xem danh sách ứng viên →
        </Link>
      </p>
      </div>
    </div>
  )
}

export default RecruiterJobStatsPage