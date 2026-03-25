// Trang quản lý register
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiPost } from '../../services/httpClient'
import { API_ENDPOINTS } from '../../constants/api'
import { ROUTES } from '../../constants/routes'

type Role = 'student' | 'recruiter'

type RegisterProps = {
  asModal?: boolean
  onSwitchToLogin?: () => void
}

type RegisterResponse = {
  id: string
  fullName: string
  email: string
  role: Role
}

const Register = ({ asModal = false, onSwitchToLogin }: RegisterProps) => {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    general?: string
  }>({})

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự.'
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email.'
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Vui lòng nhập email đúng định dạng (VD: example@student.com).'
    }
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu.'
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu cần có ít nhất 6 ký tự.'
    } else if (password.length > 32) {
      newErrors.password = 'Mật khẩu không được quá 32 ký tự.'
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

      await apiPost<RegisterResponse>(API_ENDPOINTS.AUTH_REGISTER, {
        fullName,
        email,
        password,
        role,
      })

      window.alert('Đăng ký thành công, vui lòng đăng nhập.')
      navigate(`/login?role=${role}`)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Đăng ký thất bại.'
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
          Đăng ký tài khoản
        </h1>

        <p style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '14px' }}>
          Tạo tài khoản sinh viên hoặc nhà tuyển dụng để bắt đầu sử dụng hệ
          thống.
        </p>

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
            Tôi là sinh viên
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
            Tôi là nhà tuyển dụng
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }} noValidate>
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
              onChange={(event) => {
                setFullName(event.target.value)
                if (errors.fullName) setErrors({ ...errors, fullName: undefined })
              }}
              placeholder="Nguyễn Văn A"
              maxLength={50}
              style={{
                padding: '9px 10px',
                borderRadius: '8px',
                border: errors.fullName ? '1px solid #ef4444' : '1px solid rgba(55,65,81,1)',
                backgroundColor: '#020617',
                color: '#e5e7eb',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            {errors.fullName && (
              <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.fullName}</span>
            )}
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
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register