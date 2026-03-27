import { useEffect, useState } from 'react'
import { banUserAdmin, getAdminUsers, unbanUserAdmin } from '../../features/admin/adminService'
import { PageHeader } from '../../components/common/PageHeader'

const AdminUsersPage = () => {
  const [role, setRole] = useState<'all' | 'student' | 'recruiter'>('all')
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const load = () => {
    setLoading(true)
    getAdminUsers(role === 'all' ? undefined : role)
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [role])

  return (
    <>
      <PageHeader title="Quản lý người dùng" subtitle="Xem toàn bộ sinh viên/nhà tuyển dụng và khóa hoặc mở khóa tài khoản." />
      <section className="page-ui__card">
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button className="page-ui__btn page-ui__btn--secondary" onClick={() => setRole('all')} disabled={role === 'all'}>Tất cả</button>
            <button className="page-ui__btn page-ui__btn--secondary" onClick={() => setRole('student')} disabled={role === 'student'}>Sinh viên</button>
            <button className="page-ui__btn page-ui__btn--secondary" onClick={() => setRole('recruiter')} disabled={role === 'recruiter'}>Nhà tuyển dụng</button>
        </div>
        {message && <p className="page-ui__muted" style={{ color: '#86efac' }}>{message}</p>}
        {loading && <p className="page-ui__muted">Đang tải...</p>}
        <div className="page-ui__table-wrap">
          <table className="page-ui__table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td style={{ color: u.isBanned ? '#fca5a5' : '#86efac' }}>
                    {u.isBanned ? 'Đã bị khóa' : 'Đang hoạt động'}
                  </td>
                  <td>
                    {!u.isBanned ? (
                      <button
                        className="page-ui__btn page-ui__btn--danger"
                        onClick={async () => {
                          const reason = window.prompt('Lý do khóa tài khoản (không bắt buộc):') || ''
                          await banUserAdmin(u._id, reason)
                          setMessage('Đã khóa tài khoản người dùng')
                          load()
                        }}
                      >
                        Khóa tài khoản
                      </button>
                    ) : (
                      <button
                        className="page-ui__btn page-ui__btn--success"
                        onClick={async () => {
                          await unbanUserAdmin(u._id)
                          setMessage('Đã mở khóa tài khoản người dùng')
                          load()
                        }}
                      >
                        Mở khóa
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

export default AdminUsersPage
