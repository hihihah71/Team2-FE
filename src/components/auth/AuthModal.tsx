import { useState } from 'react'
import LoginPage from '../../pages/Auth/LoginPage'
import RegisterPage from '../../pages/Auth/RegisterPage'

type AuthMode = 'login' | 'register'

type AuthModalProps = {
  mode: AuthMode
  onClose: () => void
  onSwitchMode: (mode: AuthMode) => void
}

const CLOSE_ANIMATION_MS = 260

const AuthModal = ({ mode, onClose, onSwitchMode }: AuthModalProps) => {
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
          <LoginPage asModal onSwitchToRegister={() => onSwitchMode('register')} />
        ) : (
          <RegisterPage asModal onSwitchToLogin={() => onSwitchMode('login')} />
        )}
      </div>
    </div>
  )
}

export default AuthModal


