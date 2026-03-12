import { useState } from 'react'
import Login from './Login'
import Register from './Register'

type AuthMode = 'login' | 'register'

type AuthModalProps = {
  mode: 'login' | 'register'
  role: 'student' | 'recruiter'
  onClose: () => void
  onSwitchMode: (mode: 'login' | 'register') => void
}

const CLOSE_ANIMATION_MS = 260

const AuthModal = ({ mode,role, onClose, onSwitchMode }: AuthModalProps) => {
  const [isClosing, setIsClosing] = useState(false)

  const handleRequestClose = () => {
    if (isClosing) return
    setIsClosing(true)
    window.setTimeout(onClose, CLOSE_ANIMATION_MS)
  }

  return (
    <div
      className={`auth-overlay${isClosing ? ' auth-overlay--closing' : ''}`}
      onClick={handleRequestClose}
    >
      <div
        className={`auth-modal-card${isClosing ? ' auth-modal-card--closing' : ''}`}
        onClick={(event) => event.stopPropagation()}
        style={{ maxWidth: '520px', width: '100%' }}
      >
        {mode === 'login' ? (
          <Login asModal onSwitchToRegister={() => onSwitchMode('register')} />
        ) : (
          <Register asModal onSwitchToLogin={() => onSwitchMode('login')} />
        )}
      </div>
    </div>
  )
}

export default AuthModal


