import '../../pages/PageUI.css'

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
    return (
      <div className="cv-card cv-card--empty">
        <p className="page-ui__muted">Đang tải danh sách CV...</p>
      </div>
    )
  }

  if (!cvs.length) {
    return (
      <div className="cv-card cv-card--empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '8px 0 0' }}>
          Bạn chưa có CV nào. Hãy upload CV đầu tiên để bắt đầu ứng tuyển.
        </p>
      </div>
    )
  }

  return (
    <div className="cv-list">
      {cvs.map((cv) => (
        <div key={cv._id} className={`cv-card ${cv.isDefault ? 'cv-card--default' : ''}`}>
          <div className="cv-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>

          <div className="cv-card__body">
            <div className="cv-card__header">
              <h4 className="cv-card__name">{cv.name}</h4>
              {cv.isDefault && (
                <span className="cv-card__badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  CV chính
                </span>
              )}
            </div>
            <div className="cv-card__meta">
              {cv.createdAt && (
                <span>Tạo ngày {new Date(cv.createdAt).toLocaleDateString('vi-VN')}</span>
              )}
              {cv.fileUrl && (
                <a
                  href={cv.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cv-card__open-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Xem PDF ↗
                </a>
              )}
            </div>
          </div>

          <div className="cv-card__actions">
            {!cv.isDefault && (
              <button
                type="button"
                onClick={() => onSetDefault(cv._id)}
                className="page-ui__btn page-ui__btn--secondary cv-card__action-btn"
                title="Đặt làm CV chính khi ứng tuyển"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Đặt làm chính
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(cv._id)}
              className="page-ui__btn page-ui__btn--danger cv-card__action-btn"
              title="Xóa CV"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Xóa
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StudentCVList
