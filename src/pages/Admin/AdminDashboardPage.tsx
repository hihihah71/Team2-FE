import { useEffect, useState } from 'react'
import { getAdminOverview } from '../../features/admin/adminService'
import { PageHeader } from '../../components/common/PageHeader'

const AdminDashboardPage = () => {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    getAdminOverview().then(setData).catch(() => setData(null))
  }, [])

  if (!data) return <p className="page-ui__muted">Đang tải tổng quan...</p>

  return (
    <>
      <PageHeader title="Tổng quan quản trị" subtitle="Thống kê tổng quan hệ thống kiểm duyệt." />
      <section className="page-ui__kpi-grid">
        <div className="page-ui__kpi-card"><p className="page-ui__kpi-label">Tổng người dùng</p><p className="page-ui__kpi-value">{data.totalUsers}</p></div>
        <div className="page-ui__kpi-card"><p className="page-ui__kpi-label">Tổng nhà tuyển dụng</p><p className="page-ui__kpi-value">{data.totalRecruiters}</p></div>
        <div className="page-ui__kpi-card"><p className="page-ui__kpi-label">Tổng bài đăng</p><p className="page-ui__kpi-value">{data.totalJobs}</p></div>
        <div className="page-ui__kpi-card"><p className="page-ui__kpi-label">Tổng báo cáo</p><p className="page-ui__kpi-value">{data.totalReports}</p></div>
        <div className="page-ui__kpi-card"><p className="page-ui__kpi-label">Bài đăng bị gắn cờ</p><p className="page-ui__kpi-value">{data.flaggedJobs}</p></div>
      </section>
    </>
  )
}

export default AdminDashboardPage
