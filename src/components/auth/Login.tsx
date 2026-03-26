// Trang quản lý login
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { apiPost } from '../../services/httpClient'
import { API_ENDPOINTS } from '../../constants/api'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../contexts/AuthContext'
import { validateText } from '../../utils/inputValidation'

type Role = 'student' | 'recruiter'

type LoginProps = {
  asModal?: boolean
  role?: Role
  successMessage?: string
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

const Login = ({
  asModal = false,
  role: propRole,
  successMessage,
  onSwitchToRegister,
}: LoginProps) => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [searchParams] = useSearchParams()

  // role priority:
  // 1. role passed from modal
  // 2. role from URL (?role=student)
  // 3. fallback = student
  const initialRole: Role =
    propRole ?? (searchParams.get('role') as Role) ?? 'student'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>(initialRole)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    general?: string
  }>({})

  const validate = () => {
    const newErrors: typeof errors = {}
    const emailError = validateText(email, {
      required: true,
      maxLength: 100,
      maxWords: 1,
      maxWordLength: 100,
      emptyMessage: 'Vui lòng nhập email.',
    })
    if (emailError) {
      newErrors.email = emailError
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Vui lòng nhập email đúng định dạng.'
      }
    }
    const passwordError = validateText(password, {
      required: true,
      minLength: 6,
      maxLength: 32,
      maxWords: 1,
      maxWordLength: 32,
      emptyMessage: 'Vui lòng nhập mật khẩu.',
    })
    if (passwordError) {
      newErrors.password = passwordError
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!validate()) return

    try {
      setLoading(true)
      setErrors({})

      const data = await apiPost<LoginResponse>(API_ENDPOINTS.AUTH_LOGIN, {
        email,
        password,
        role,
      })

      login(data.token, data.user)

      if (data.user.role === 'student') {
        navigate(ROUTES.STUDENT_DASHBOARD)
      } else {
        navigate(ROUTES.RECRUITER_DASHBOARD)
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Đăng nhập thất bại.'
      setErrors({ general: message })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true)
      setErrors({})

      const data = await apiPost<LoginResponse>(API_ENDPOINTS.AUTH_GOOGLE, {
        idToken: credentialResponse.credential,
        role,
      })

      login(data.token, data.user)

      if (data.user.role === 'student') {
        navigate(ROUTES.STUDENT_DASHBOARD)
      } else {
        navigate(ROUTES.RECRUITER_DASHBOARD)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đăng nhập Google thất bại.'
      setErrors({ general: message })
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
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>
              CV Matching Platform
            </span>

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
        
        {successMessage && (
          <div 
            style={{ 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px',
              textAlign: 'center'
            }}
          >
            {successMessage}
          </div>
        )}

        {/* Role toggle */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            backgroundColor: '#020617',
            padding: '4px',
            borderRadius: '999px',
            border: '1px solid rgba(55,65,81,1)',
          }}
        >
          <button
            type="button"
            onClick={() => setRole('student')}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: role === 'student' ? '#1d4ed8' : 'transparent',
              color: role === 'student' ? '#f9fafb' : '#9ca3af',
              transition: 'background-color 0.15s ease, color 0.15s ease',
            }}
          >
            Sinh viên
          </button>
          <button
            type="button"
            onClick={() => setRole('recruiter')}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: role === 'recruiter' ? '#1d4ed8' : 'transparent',
              color: role === 'recruiter' ? '#f9fafb' : '#9ca3af',
              transition: 'background-color 0.15s ease, color 0.15s ease',
            }}
          >
            Nhà tuyển dụng
          </button>
        </div>

        <form 
          onSubmit={handleSubmit} 
          style={{ display: 'grid', gap: '14px' }} 
          noValidate
        >
          <div style={{ display: 'grid', gap: '6px' }}>
            <label
              htmlFor="email"
              style={{ fontSize: '14px', fontWeight: 500, color: '#d1d5db' }}
            >
              Email
            </label>

            <input
              id="email"
              type="text"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (errors.email) setErrors({ ...errors, email: undefined })
              }}
              placeholder="example@student.edu.vn"
              maxLength={100}
              style={{
                padding: '9px 10px',
                borderRadius: '8px',
                border: errors.email ? '1px solid #ef4444' : '1px solid rgba(55,65,81,1)',
                backgroundColor: '#020617',
                color: '#e5e7eb',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            {errors.email && (
              <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.email}</span>
            )}
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
              onChange={(event) => {
                setPassword(event.target.value)
                if (errors.password) setErrors({ ...errors, password: undefined })
              }}
              placeholder="••••••••"
              maxLength={32}
              style={{
                padding: '9px 10px',
                borderRadius: '8px',
                border: errors.password ? '1px solid #ef4444' : '1px solid rgba(55,65,81,1)',
                backgroundColor: '#020617',
                color: '#e5e7eb',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            {errors.password && (
              <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.password}</span>
            )}
          </div>

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

          {errors.general && (
            <div style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center' }}>
              {errors.general}
            </div>
          )}

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
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(148,163,184,0.2)' }} />
            <span style={{ padding: '0 10px', fontSize: '12px', color: '#9ca3af' }}>Hoặc</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(148,163,184,0.2)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setErrors({ general: 'Đăng nhập Google thất bại.' })}
              theme="filled_black"
              shape="pill"
              text="signin_with"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login