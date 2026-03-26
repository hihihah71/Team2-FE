import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from '../../constants/api'
import { ROUTES } from '../../constants/routes'
import { apiPost } from '../../services/httpClient'
import { useAuth } from '../../contexts/AuthContext'

const AdminLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const data = await apiPost<{ token: string; user: any }>(API_ENDPOINTS.AUTH_LOGIN, {
        email,
        password,
        role: 'admin',
      })
      if (data.user.role !== 'admin') throw new Error('Tài khoản không có quyền admin')
      login(data.token, data.user)
      navigate(ROUTES.ADMIN_DASHBOARD)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={onSubmit} style={{ width: 360, display: 'grid', gap: 10 }}>
        <h2>Admin Login</h2>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button disabled={loading} type="submit">{loading ? 'Loading...' : 'Login'}</button>
      </form>
    </div>
  )
}

export default AdminLoginPage
