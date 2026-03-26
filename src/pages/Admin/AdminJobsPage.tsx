import { useEffect, useState } from 'react'
import { banJobAdmin, getAdminJobs } from '../../features/admin/adminService'
import { PageHeader } from '../../components/common/PageHeader'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'

const AdminJobsPage = () => {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const load = () => {
    setLoading(true)
    getAdminJobs().then(setJobs).catch(() => setJobs([])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  return (
    <>
      <PageHeader title="Kiểm duyệt bài đăng" subtitle="Quản lý trạng thái duyệt bài đăng tuyển dụng." />
      <section className="page-ui__card">
      {message && <p className="page-ui__muted" style={{ color: '#86efac' }}>{message}</p>}
      {loading && <p className="page-ui__muted">Đang tải...</p>}
      <div className="page-ui__table-wrap">
        <table className="page-ui__table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Nhà tuyển dụng</th>
              <th>Báo cáo</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j._id}>
                <td>{j.title}</td>
                <td>{j.company || 'Không rõ'}</td>
                <td>{j.reportCount || 0}</td>
                <td>
                  <span className="page-ui__pill" style={{ borderColor: j.moderationStatus === 'rejected' ? 'rgba(239,68,68,0.5)' : undefined, color: j.moderationStatus === 'rejected' ? '#fca5a5' : undefined }}>
                    {j.moderationStatus === 'rejected' ? 'Đã bị ban' : 'Bình thường'}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <Link className="page-ui__btn page-ui__btn--secondary" to={ROUTES.ADMIN_JOB_DETAIL.replace(':jobId', j._id)} style={{ textDecoration: 'none' }}>
                    Xem chi tiết
                  </Link>
                  <button
                    className="page-ui__btn page-ui__btn--danger"
                    disabled={j.moderationStatus === 'rejected'}
                    onClick={async () => {
                      if (!window.confirm('Ban bài đăng này?')) return
                      await banJobAdmin(j._id)
                      setMessage('Đã ban bài đăng')
                      load()
                    }}
                  >
                    Ban bài
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </section>
    </>
  )
}

export default AdminJobsPage
