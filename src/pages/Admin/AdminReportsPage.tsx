import { useEffect, useState } from 'react'
import { getAdminReports, resolveReportAdmin } from '../../features/admin/adminService'
import { PageHeader } from '../../components/common/PageHeader'

const AdminReportsPage = () => {
  const [reports, setReports] = useState<any[]>([])
  const [status, setStatus] = useState('pending')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const load = () => {
    setLoading(true)
    getAdminReports(status).then(setReports).catch(() => setReports([])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [status])

  return (
    <>
      <PageHeader title="Quản lý báo cáo" subtitle="Theo dõi và xử lý các báo cáo từ người dùng." />
      <section className="page-ui__card">
      <select className="page-ui__input" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">Chờ xử lý</option>
        <option value="resolved">Đã xử lý</option>
      </select>
      {message && <p className="page-ui__muted" style={{ color: '#86efac' }}>{message}</p>}
      {loading && <p className="page-ui__muted">Đang tải...</p>}
      <div className="page-ui__table-wrap" style={{ marginTop: 12 }}>
        <table className="page-ui__table">
          <thead>
            <tr>
              <th>Loại mục tiêu</th>
              <th>Lý do</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id}>
                <td>{r.targetType}</td>
                <td>{r.reason}</td>
                <td>{r.status === 'resolved' ? 'Đã xử lý' : 'Chờ xử lý'}</td>
                <td>
                  {r.status !== 'resolved' && (
                    <button
                      className="page-ui__btn page-ui__btn--success"
                      onClick={async () => {
                        await resolveReportAdmin(r._id)
                        setMessage('Đã đánh dấu đã xử lý')
                        load()
                      }}
                    >
                      Đánh dấu đã xử lý
                    </button>
                  )}
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

export default AdminReportsPage
