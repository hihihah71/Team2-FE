import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationsProvider } from './contexts/NotificationsContext'
import { AppRoutes } from './routes'
import { PageTransition } from './components/common/PageTransition'

function AnimatedBackground() {
  return (
    <div className="animated-bg" aria-hidden="true">
      <div className="animated-bg__orb animated-bg__orb--1" />
      <div className="animated-bg__orb animated-bg__orb--2" />
      <div className="animated-bg__orb animated-bg__orb--3" />
      <div className="animated-bg__orb animated-bg__orb--4" />
      <div className="animated-bg__grid" />
      <div className="animated-bg__particles">
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationsProvider>
          <AnimatedBackground />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <PageTransition>
              <AppRoutes />
            </PageTransition>
          </div>
        </NotificationsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
