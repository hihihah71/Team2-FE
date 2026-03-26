import { useState } from 'react'
import { createPortal } from 'react-dom'
import Login from './Login'
import Register from './Register'


type AuthModalProps = {
  mode: 'login' | 'register'
  role: 'student' | 'recruiter'
  onClose: () => void
  onSwitchMode: (mode: 'login' | 'register') => void
}

const CLOSE_ANIMATION_MS = 260

const AuthModal = ({ mode, role, onClose, onSwitchMode }: AuthModalProps) => {
  const [isClosing, setIsClosing] = useState(false)
  const [activeMessage, setActiveMessage] = useState<string | undefined>()

  const handleSwitchMode = (newMode: 'login' | 'register', message?: string) => {
    setActiveMessage(message)
    onSwitchMode(newMode)
  }

  const handleRequestClose = () => {
    if (isClosing) return
    setIsClosing(true)
    window.setTimeout(onClose, CLOSE_ANIMATION_MS)
  }

  const modalContent = (
    <div
      className={`auth-overlay${isClosing ? ' auth-overlay--closing' : ''}`}
      onClick={handleRequestClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <div
        className={`auth-modal-card${isClosing ? ' auth-modal-card--closing' : ''}`}
        onClick={(event) => event.stopPropagation()}
        style={{ maxWidth: '520px', width: '100%', position: 'relative' }}
      >
        {mode === 'login' ? (
          <Login
            asModal
            role={role}
            successMessage={activeMessage}
            onSwitchToRegister={() => handleSwitchMode('register')}
          />
        ) : (
          <Register
            asModal
            onSwitchToLogin={(msg) => handleSwitchMode('login', msg)}
          />
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default AuthModal



