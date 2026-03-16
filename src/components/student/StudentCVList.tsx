type CvItem = {
  _id: string
  name: string
  fileUrl?: string
  isDefault?: boolean
  createdAt?: string
}

type Props = {
  cvs: CvItem[]
  loading: boolean
  onSetDefault: (id: string) => void
  onDelete: (id: string) => void
}

const StudentCVList = ({ cvs, loading, onSetDefault, onDelete }: Props) => {
  if (loading) {
    return <p style={{ color: '#9ca3af', fontSize: '14px' }}>Đang tải danh sách CV...</p>
  }

  if (!cvs.length) {
    return (
      <p style={{ color: '#9ca3af', fontSize: '14px' }}>
        Bạn chưa có CV nào. Hãy upload CV đầu tiên để bắt đầu ứng tuyển.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {cvs.map((cv) => (
        <div
          key={cv._id}
          style={{
            borderRadius: '10px',
            padding: '12px 14px',
            border: '1px solid rgba(55,65,81,1)',
            backgroundColor: '#020617',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600 }}>
              {cv.name}
              {cv.isDefault && (
                <span
                  style={{
                    marginLeft: '8px',
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(34,197,94,0.1)',
                    color: '#22c55e',
                    border: '1px solid rgba(34,197,94,0.4)',
                  }}
                >
                  Đang dùng
                </span>
              )}
            </p>
            {cv.createdAt && (
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                Tạo ngày {new Date(cv.createdAt).toLocaleDateString('vi-VN')}
              </p>
            )}
            {cv.fileUrl && (
              <a
                href={cv.fileUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '12px', color: '#60a5fa' }}
              >
                Mở CV →
              </a>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            {!cv.isDefault && (
              <button
                type="button"
                onClick={() => onSetDefault(cv._id)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '999px',
                  border: '1px solid rgba(59,130,246,0.7)',
                  background: 'transparent',
                  color: '#60a5fa',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Đặt làm CV chính
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(cv._id)}
              style={{
                padding: '6px 10px',
                borderRadius: '999px',
                border: '1px solid rgba(248,113,113,0.7)',
                background: 'transparent',
                color: '#fca5a5',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Xóa
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StudentCVList

