import { useEffect, useState } from 'react'
import { approveRecruiter, banUserAdmin, getAdminRecruiters, rejectRecruiter } from '../../features/admin/adminService'
import { PageHeader } from '../../components/common/PageHeader'

const AdminRecruitersPage = () => {
  const [status, setStatus] = useState<'pending' | 'approved'>('pending')
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [actioningId, setActioningId] = useState('')
  const [message, setMessage] = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    getAdminRecruiters(status)
      .then(setUsers)
      .catch((e) => setError(e instanceof Error ? e.message : 'Không thể tải danh sách recruiter'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [status])

  return (
    <>
      <PageHeader title="Duyệt nhà tuyển dụng" subtitle="Duyệt hoặc từ chối tài khoản nhà tuyển dụng." />
      <section className="page-ui__card">
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button className="page-ui__btn page-ui__btn--secondary" onClick={() => setStatus('pending')} disabled={status === 'pending'}>Chờ duyệt</button>
        <button className="page-ui__btn page-ui__btn--secondary" onClick={() => setStatus('approved')} disabled={status === 'approved'}>Đã duyệt</button>
      </div>
      {message && <p className="page-ui__muted" style={{ color: '#86efac' }}>{message}</p>}
      {error && <p className="page-ui__error">{error}</p>}
      {loading && <p className="page-ui__muted">Đang tải...</p>}
      {users.map((u) => (
        <div key={u._id} style={{ display: 'grid', gap: 8, marginBottom: 8, borderBottom: '1px solid #334155', paddingBottom: 10 }}>
          <span>{u.fullName} ({u.email})</span>
          {u.verificationRequestNote ? (
            <p className="page-ui__muted" style={{ margin: 0 }}>
              Ghi chú bằng chứng: {u.verificationRequestNote}
            </p>
          ) : (
            <p className="page-ui__muted" style={{ margin: 0 }}>Chưa có ghi chú bằng chứng.</p>
          )}
          {Array.isArray(u.verificationEvidenceImages) && u.verificationEvidenceImages.length > 0 ? (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {u.verificationEvidenceImages.map((img: string) => (
                <a key={img} href={img} target="_blank" rel="noreferrer" className="page-ui__button page-ui__button--secondary">
                  Xem ảnh minh chứng
                </a>
              ))}
            </div>
          ) : null}
          <div style={{ display: 'flex', gap: 10 }}>
            {status === 'pending' ? (
              <>
                <button
                  className="page-ui__btn page-ui__btn--success"
                  disabled={actioningId === u._id}
                  onClick={async () => {
                    if (!window.confirm('Duyệt tài khoản nhà tuyển dụng này?')) return
                    setActioningId(u._id)
                    await approveRecruiter(u._id)
                    setActioningId('')
                    setMessage('Đã duyệt nhà tuyển dụng')
                    load()
                  }}
                >
                  Duyệt
                </button>
                <button
                  className="page-ui__btn page-ui__btn--danger"
                  disabled={actioningId === u._id}
                  onClick={async () => {
                    const reason = window.prompt('Lý do từ chối (không bắt buộc):') || ''
                    if (!window.confirm('Từ chối tài khoản nhà tuyển dụng này?')) return
                    setActioningId(u._id)
                    await rejectRecruiter(u._id, reason)
                    setActioningId('')
                    setMessage('Đã từ chối nhà tuyển dụng')
                    load()
                  }}
                >
                  Từ chối
                </button>
              </>
            ) : (
              <button
                className="page-ui__btn page-ui__btn--danger"
                disabled={actioningId === u._id}
                onClick={async () => {
                  const reason = window.prompt('Lý do ban tài khoản (không bắt buộc):') || ''
                  if (!window.confirm('Ban tài khoản nhà tuyển dụng này?')) return
                  setActioningId(u._id)
                  await banUserAdmin(u._id, reason)
                  setActioningId('')
                  setMessage('Đã ban nhà tuyển dụng')
                  load()
                }}
              >
                Ban
              </button>
            )}
          </div>
        </div>
      ))}
      </section>
    </>
  )
}

export default AdminRecruitersPage
