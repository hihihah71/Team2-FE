type StudentJobFiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  loading: boolean
  total: number
}

const StudentJobFilters = ({ search, onSearchChange, loading, total }: StudentJobFiltersProps) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ flex: '1 1 260px' }}>
        <input
          type="text"
          placeholder="Tìm theo vị trí, công ty, địa điểm..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: '8px',
            border: '1px solid #4b5563',
            backgroundColor: '#020617',
            color: '#e5e7eb',
            fontSize: '14px',
          }}
        />
      </div>
      <div style={{ fontSize: '13px', color: '#9ca3af' }}>
        {loading ? 'Đang tải danh sách công việc...' : `${total} việc làm phù hợp`}
      </div>
    </div>
  )
}

export default StudentJobFilters

