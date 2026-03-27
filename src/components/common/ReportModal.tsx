import { useState } from 'react'

type ReportModalProps = {
  isOpen: boolean
  loading?: boolean
  title?: string
  onClose: () => void
  onSubmit: (reason: string) => Promise<void> | void
}

const ReportModal = ({ isOpen, loading = false, title = 'Báo cáo nội dung', onClose, onSubmit }: ReportModalProps) => {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async () => {
    const trimmed = reason.trim()
    if (trimmed.length < 5) {
      setError('Lý do báo cáo cần ít nhất 5 ký tự.')
      return
    }
    setError('')
    await onSubmit(trimmed)
    setReason('')
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2,6,23,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 120,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div className="page-ui__card" style={{ width: 'min(560px, 100%)' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <textarea
          className="page-ui__textarea"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Mô tả lý do báo cáo..."
          maxLength={500}
          style={{ minHeight: '140px' }}
        />
        {error && <p className="page-ui__error">{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
          <button className="page-ui__btn page-ui__btn--secondary" onClick={onClose}>Hủy</button>
          <button className="page-ui__btn page-ui__btn--danger" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportModal
