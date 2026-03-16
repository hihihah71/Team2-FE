import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import './PageTransition.css'

export const PageTransition = ({ children }: { children: ReactNode }) => {
  const location = useLocation()
  const [displayedChildren, setDisplayedChildren] = useState(children)
  const [phase, setPhase] = useState<'in' | 'out'>('in')

  useEffect(() => {
    setPhase('out')
    const timeout = window.setTimeout(() => {
      setDisplayedChildren(children)
      setPhase('in')
    }, 150)
    return () => window.clearTimeout(timeout)
  }, [location.pathname])

  return (
    <div className={`page-transition page-transition--${phase}`}>
      {displayedChildren}
    </div>
  )
}
