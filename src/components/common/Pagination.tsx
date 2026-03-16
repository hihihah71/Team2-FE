type PaginationProps = {
  page: number
  totalPages: number
  onChange: (nextPage: number) => void
}

export const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
      <button
        className="page-ui__button page-ui__button--secondary"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        Trước
      </button>
      <span className="page-ui__muted" style={{ alignSelf: 'center' }}>
        Trang {page}/{totalPages}
      </span>
      <button
        className="page-ui__button page-ui__button--secondary"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        Sau
      </button>
    </div>
  )
}
