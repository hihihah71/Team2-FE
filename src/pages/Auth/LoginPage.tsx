// Trang quản lý login
import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { apiPost } from '../../services/httpClient'

type Role = 'student' | 'recruiter'

type LoginResponse = {
  token: string
  user: {
    id: string
    fullName: string
    email: string
    role: Role
  }
}

const LoginPage = () => {
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
      >('/auth/login', {
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
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top, #1f2937, #020617)',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#020617',
          borderRadius: '16px',
          padding: '28px 32px',
          border: '1px solid rgba(148,163,184,0.35)',
          boxShadow: '0 20px 45px -15px rgba(15,23,42,0.9)',
          color: '#e5e7eb',
        }}
      >
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
                onClick={() => setRole('student')}
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
                onClick={() => setRole('recruiter')}
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