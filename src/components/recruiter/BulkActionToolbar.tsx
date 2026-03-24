interface BulkActionToolbarProps {
  selectedCount: number;
  onAction: (status: any) => void;
  onClear: () => void;
}

export const BulkActionToolbar = ({ selectedCount, onAction, onClear }: BulkActionToolbarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="page-ui__card" style={{ 
      position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 100, display: 'flex', alignItems: 'center', gap: '20px',
      backgroundColor: '#1e293b', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'
    }}>
      <span style={{ fontSize: '14px', fontWeight: 600 }}>Đã chọn {selectedCount} ứng viên</span>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => onAction('shortlisted')} className="page-ui__btn page-ui__btn--success">Duyệt hàng loạt</button>
        <button onClick={() => onAction('rejected')} className="page-ui__btn page-ui__btn--danger">Từ chối hàng loạt</button>
        <button onClick={onClear} className="page-ui__btn page-ui__btn--secondary">Hủy</button>
      </div>
    </div>
  );
};