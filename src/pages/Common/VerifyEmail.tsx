import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiGet } from '../../services/httpClient'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    const verify = async () => {
      try {
        await apiGet(`/auth/verify-email?token=${token}`)
        alert('Xác minh email thành công')
      } catch (err) {
        alert('Token không hợp lệ hoặc đã hết hạn')
      }
    }

    if (token) verify()
  }, [token])

  return <div>Đang xác minh email...</div>
}

export default VerifyEmailPage