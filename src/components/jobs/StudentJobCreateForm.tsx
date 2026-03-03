import { useState, type FormEvent } from 'react'
import { apiPost } from '../../services/httpClient'
import { API_ENDPOINTS } from '../../constants/api'
import type { Job } from '../../types/job'

type StudentJobCreateFormProps = {
  onCreated: (job: Job) => void
}

const StudentJobCreateForm = ({ onCreated }: StudentJobCreateFormProps) => {
  const [form, setForm] = useState({
    title: '',
    companyName: '',
    location: '',
  })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!form.title.trim() || !form.companyName.trim()) {
      setError('Vui lòng nhập tiêu đề và tên công ty.')
      return
    }

    try {
      setCreating(true)
      const created = await apiPost<Job, typeof form>(API_ENDPOINTS.JOBS_CREATE, form)
      if (created) {
        onCreated(created)
        setForm({
          title: '',
          companyName: '',
          location: '',
        })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể tạo bài đăng mới.'
      setError(message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div
      style={{
        borderTop: '1px solid #1f2937',
        paddingTop: '16px',
        marginTop: '8px',
      }}
    >
      <h2
        style={{
          fontSize: '15px',
          fontWeight: 600,
          marginBottom: '8px',
        }}
      >
        Thêm bài đăng mới
      </h2>
      <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '10px' }}>
        Tạo nhanh một bài đăng thử nghiệm để kiểm tra luồng chi tiết job và ứng tuyển.
      </p>
      {error && (
        <p style={{ color: '#fca5a5', fontSize: '13px', marginBottom: '8px' }}>{error}</p>
      )}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gap: '8px',
          maxWidth: '520px',
        }}
      >
        <div style={{ display: 'grid', gap: '4px' }}>
          <label style={{ fontSize: '13px', color: '#9ca3af' }}>Tiêu đề</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid #4b5563',
              backgroundColor: '#020617',
              color: '#e5e7eb',
              fontSize: '14px',
            }}
          />
        </div>
        <div style={{ display: 'grid', gap: '4px' }}>
          <label style={{ fontSize: '13px', color: '#9ca3af' }}>Công ty</label>
          <input
            type="text"
            value={form.companyName}
            onChange={(e) => setForm((prev) => ({ ...prev, companyName: e.target.value }))}
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid #4b5563',
              backgroundColor: '#020617',
              color: '#e5e7eb',
              fontSize: '14px',
            }}
          />
        </div>
        <div style={{ display: 'grid', gap: '4px' }}>
          <label style={{ fontSize: '13px', color: '#9ca3af' }}>Địa điểm</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid #4b5563',
              backgroundColor: '#020617',
              color: '#e5e7eb',
              fontSize: '14px',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          style={{
            marginTop: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.9), rgba(22,163,74,0.9))',
            color: '#fff',
            fontWeight: 600,
            border: 'none',
            fontSize: '14px',
            opacity: creating ? 0.8 : 1,
            cursor: creating ? 'default' : 'pointer',
            alignSelf: 'flex-start',
          }}
        >
          {creating ? 'Đang tạo...' : 'Thêm bài đăng'}
        </button>
      </form>
    </div>
  )
}

export default StudentJobCreateForm

