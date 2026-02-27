// Trang quản lý register
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiPost } from '../../services/httpClient'
import AuthRoleToggle from '../../components/auth/AuthRoleToggle'
import { API_ENDPOINTS } from '../../constants/api'
import { ROUTES } from '../../constants/routes'

type Role = 'student' | 'recruiter'

type RegisterPageProps = {
  asModal?: boolean
  onSwitchToLogin?: () => void
}

const RegisterPage = ({ asModal = false, onSwitchToLogin }: RegisterPageProps) => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!fullName || !email || !password) {
      window.alert('Vui lòng nhập đầy đủ họ tên, email và mật khẩu.')
      return
    }

    try {
      setLoading(true)

      await apiPost<
        unknown,
        { fullName: string; email: string; password: string; role: Role }
      >(API_ENDPOINTS.AUTH_REGISTER, {
        fullName,
        email,
        password,
        role,
      })

      window.alert('Đăng ký thành công, vui lòng đăng nhập.')
      navigate(`/login?role=${role}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đăng ký thất bại.'
      window.alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={asModal ? undefined : 'auth-page'}
      style={
        asModal
          ? {}
          : {
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle at top, #0f172a, #020617)',
              padding: '24px',
            }
      }
    >
      <div
        className="auth-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#020617',
          borderRadius: '16px',
          padding: '24px 28px 28px 28px',
          border: '1px solid rgba(148,163,184,0.35)',
          boxShadow: '0 20px 45px -15px rgba(15,23,42,0.9)',
          color: '#e5e7eb',
        }}
      >
        {!asModal && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>CV Matching Platform</span>
            <Link
              to={ROUTES.HOME}
              style={{
                fontSize: '12px',
                color: '#9ca3af',
                textDecoration: 'underline',
              }}
            >
              Về trang chính
            </Link>
          </div>
        )}
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '4px',
          }}
        >
          Đăng ký tài khoản
        </h1>
        <p style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '14px' }}>
          Tạo tài khoản sinh viên hoặc nhà tuyển dụng để bắt đầu sử dụng hệ
          thống.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          <div style={{ display: 'grid', gap: '6px' }}>
            <label
              htmlFor="fullName"
              style={{ fontSize: '14px', fontWeight: 500, color: '#d1d5db' }}
            >
              Họ và tên
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Nguyễn Văn A"
              style={{
                padding: '9px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(55,65,81,1)',
                backgroundColor: '#020617',
                color: '#e5e7eb',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: '6px' }}>
            <label
              htmlFor="email"
              style={{ fontSize: '14px', fontWeight: 500, color: '#d1d5db' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@student.edu.vn"
              style={{
                padding: '9px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(55,65,81,1)',
                backgroundColor: '#020617',
                color: '#e5e7eb',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: '6px' }}>
            <label
              htmlFor="password"
              style={{ fontSize: '14px', fontWeight: 500, color: '#d1d5db' }}
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              style={{
                padding: '9px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(55,65,81,1)',
                backgroundColor: '#020617',
                color: '#e5e7eb',
                fontSize: '14px',
              }}
            />
          </div>

          <AuthRoleToggle role={role} onChange={setRole} />

          <p
            style={{
              marginTop: '4px',
              fontSize: '13px',
              color: '#9ca3af',
            }}
          >
            Đã có tài khoản?{' '}
            {asModal && onSwitchToLogin ? (
              <button
                type="button"
                onClick={onSwitchToLogin}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  margin: 0,
                  color: '#60a5fa',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                Đăng nhập
              </button>
            ) : (
              <Link
                to={`/login?role=${role}`}
                style={{
                  color: '#60a5fa',
                  textDecoration: 'underline',
                }}
              >
                Đăng nhập
              </Link>
            )}
          </p>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '4px',
              padding: '10px 12px',
              borderRadius: '10px',
              border: 'none',
              background:
                'linear-gradient(135deg, rgba(59,130,246,1), rgba(129,140,248,1))',
              color: '#f9fafb',
              fontWeight: 600,
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
