// Trang quản lý login
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { apiPost } from '../../services/httpClient'
import { API_ENDPOINTS } from '../../constants/api'
import { ROUTES } from '../../constants/routes'
import AuthRoleToggle from '../../components/auth/AuthRoleToggle'

type Role = 'student' | 'recruiter'

type LoginPageProps = {
  asModal?: boolean
  onSwitchToRegister?: () => void
}

type LoginResponse = {
  token: string
  user: {
    id: string
    fullName: string
    email: string
    role: Role
  }
}

const LoginPage = ({ asModal = false, onSwitchToRegister }: LoginPageProps) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initialRole = (searchParams.get('role') as Role) || 'student'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>(initialRole)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!email || !password) {
      window.alert('Vui lòng nhập đủ email và mật khẩu.')
      return
    }

    try {
      setLoading(true)

      const data = await apiPost<
        LoginResponse,
        { email: string; password: string; role: Role }
      >(API_ENDPOINTS.AUTH_LOGIN, {
        email,
        password,
        role,
      })

      // Lưu token tạm vào localStorage để dùng sau này
      window.localStorage.setItem('access_token', data.token)
      window.localStorage.setItem('current_user', JSON.stringify(data.user))

      if (data.user.role === 'student') {
        navigate('/student/dashboard')
      } else {
        // Sau này chuyển sang dashboard của recruiter
        navigate('/')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đăng nhập thất bại.'
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
              background: 'radial-gradient(circle at top, #1f2937, #020617)',
              padding: '24px',
            }
      }
    >
      <div
        className="auth-card"
        style={{
          width: '100%',
          maxWidth: '420px',
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
          Đăng nhập
        </h1>
        <p style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '14px' }}>
          Truy cập nền tảng quản lý CV cho sinh viên và nhà tuyển dụng.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
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
            Chưa có tài khoản?{' '}
            {asModal && onSwitchToRegister ? (
              <button
                type="button"
                onClick={onSwitchToRegister}
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
                Đăng ký ngay
              </button>
            ) : (
              <Link
                to="/register"
                style={{
                  color: '#60a5fa',
                  textDecoration: 'underline',
                }}
              >
                Đăng ký ngay
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
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

// Trang quản lý login