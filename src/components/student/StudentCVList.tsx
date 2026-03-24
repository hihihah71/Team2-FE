import '../../pages/PageUI.css'
import { Eye } from 'lucide-react'

import type { CvItem } from '../../types/domain'

type Props = {
  cvs: CvItem[]
  loading: boolean
  onSetDefault: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (cv: CvItem) => void
}

const StudentCVList = ({ cvs, loading, onSetDefault, onDelete, onEdit }: Props) => {
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
      {cvs.map((cv) => {
        const isSaaS = !!cv.cvData
        return (
          <div key={cv._id} className={`cv-card ${cv.isDefault ? 'cv-card--default' : ''}`} style={isSaaS ? { borderLeft: '4px solid #6366f1' } : {}}>
            <div className="cv-card__icon" style={isSaaS ? { color: '#6366f1' } : {}}>
              {isSaaS ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              )}
            </div>

            <div className="cv-card__body">
              <div className="cv-card__header">
                <h4 className="cv-card__name">{cv.name}</h4>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {isSaaS && (
                    <span className="cv-card__badge" style={{ backgroundColor: '#eef2ff', color: '#6366f1', border: '1px solid #e0e7ff' }}>
                       🎨 Thiết kế SaaS
                    </span>
                  )}
                  {cv.isDefault && (
                    <span className="cv-card__badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Chính
                    </span>
                  )}
                </div>
              </div>
              <div className="cv-card__meta">
                {cv.createdAt && (
                  <span>Ngày tạo: {new Date(cv.createdAt).toLocaleDateString('vi-VN')}</span>
                )}
                {cv.fileUrl && (
                  <a href={cv.fileUrl} target="_blank" rel="noreferrer" className="cv-card__open-link" onClick={(e) => e.stopPropagation()}>
                    Xem PDF ↗
                  </a>
                )}
                {cv.isPublic && cv.slug && (
                  <a href={`/public/cv/${cv.slug}`} target="_blank" rel="noreferrer" className="cv-card__open-link" onClick={(e) => e.stopPropagation()} style={{ color: '#10b981' }}>
                    Web Profile ↗
                  </a>
                )}
              </div>
              
              {(cv.viewCount !== undefined && cv.isPublic) && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                  <Eye size={14} /> {cv.viewCount} lượt xem
                </div>
              )}
            </div>

            <div className="cv-card__actions">
              <button
                type="button"
                onClick={() => onEdit(cv)}
                className="page-ui__btn page-ui__btn--primary cv-card__action-btn"
                title={isSaaS ? "Chỉnh sửa thiết kế SaaS" : "Nâng cấp lên thiết kế SaaS"}
                style={{ backgroundColor: isSaaS ? '#6366f1' : '#475569', color: 'white' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                {isSaaS ? 'Sửa thiết kế SV' : 'Sửa bằng Builder'}
              </button>
              {!cv.isDefault && (
                <button
                  type="button"
                  onClick={() => onSetDefault(cv._id)}
                  className="page-ui__btn page-ui__btn--secondary cv-card__action-btn"
                >
                  Đặt làm chính
                </button>
              )}
              <button
                type="button"
                onClick={() => onDelete(cv._id)}
                className="page-ui__btn page-ui__btn--danger cv-card__action-btn"
              >
                Xóa
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StudentCVList
