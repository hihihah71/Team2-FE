type Role = 'student' | 'recruiter'

type AuthRoleToggleProps = {
  role: Role
  onChange: (role: Role) => void
}

const AuthRoleToggle = ({ role, onChange }: AuthRoleToggleProps) => {
  return (
    <div style={{ display: 'grid', gap: '6px' }}>
      <span
        style={{ fontSize: '14px', fontWeight: 500, color: '#d1d5db' }}
      >
        Bạn là
      </span>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
        }}
      >
        <button
          type="button"
          onClick={() => onChange('student')}
          style={{
            padding: '8px 10px',
            borderRadius: '999px',
            border:
              role === 'student'
                ? '1px solid rgba(59,130,246,1)'
                : '1px solid rgba(55,65,81,1)',
            background:
              role === 'student'
                ? 'linear-gradient(135deg,#2563eb,#4f46e5)'
                : '#020617',
            color: role === 'student' ? '#f9fafb' : '#9ca3af',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Sinh viên
        </button>
        <button
          type="button"
          onClick={() => onChange('recruiter')}
          style={{
            padding: '8px 10px',
            borderRadius: '999px',
            border:
              role === 'recruiter'
                ? '1px solid rgba(34,197,94,1)'
                : '1px solid rgba(55,65,81,1)',
            background:
              role === 'recruiter'
                ? 'linear-gradient(135deg,#22c55e,#14b8a6)'
                : '#020617',
            color: role === 'recruiter' ? '#022c22' : '#9ca3af',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Nhà tuyển dụng
        </button>
      </div>
    </div>
  )
}

export default AuthRoleToggle

