import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiGet } from '../services/httpClient'
import { API_ENDPOINTS } from '../constants/api'

const TOKEN_KEY = 'access_token'

export type User = {
  id: string
  fullName: string
  email: string
  role: 'student' | 'recruiter' | 'admin'
  isVerified?: boolean
  isVerifiedRecruiter?: boolean
  verificationRequestNote?: string
  verificationEvidenceImages?: string[]
  verificationRequestedAt?: string | null
  verificationRejectReason?: string
  isBanned?: boolean
  skills?: string[]
}

type AuthContextValue = {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const login = useCallback((token: string, userData: User) => {
    window.localStorage.setItem(TOKEN_KEY, token)
    window.localStorage.setItem('current_user', JSON.stringify(userData))
    setUserState(userData)
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem('current_user')
    setUserState(null)
    window.location.href = '/' // Force hard redirect to home
  }, [])

  // Khôi phục phiên khi load/reload: có token thì gọi /auth/me để validate và lấy user
  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    apiGet<{
      id: string
      fullName: string
      email: string
      role: 'student' | 'recruiter' | 'admin'
      isVerified: boolean
      isVerifiedRecruiter?: boolean
      verificationRequestNote?: string
      verificationEvidenceImages?: string[]
      verificationRequestedAt?: string | null
      verificationRejectReason?: string
      isBanned?: boolean
    }>(
      API_ENDPOINTS.AUTH_ME,
    )
      .then((data) => {
        setUserState({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          isVerified: data.isVerified,
          isVerifiedRecruiter: data.isVerifiedRecruiter,
          verificationRequestNote: data.verificationRequestNote,
          verificationEvidenceImages: data.verificationEvidenceImages || [],
          verificationRequestedAt: data.verificationRequestedAt || null,
          verificationRejectReason: data.verificationRejectReason || '',
          isBanned: data.isBanned,
        })
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY)
        window.localStorage.removeItem('current_user')
        setUserState(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    setUser: setUserState,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}