import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

function getDepth(pathname: string) {
  return pathname.split('/').filter(Boolean).length
}

function getParentPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length <= 1) return '/'
  return `/${segments.slice(0, -1).join('/')}`
}

export function useScrollToTopOnDrillDown() {
  const location = useLocation()
  const previousPathRef = useRef(normalizePath(location.pathname))

  useEffect(() => {
    const previousPath = previousPathRef.current
    const currentPath = normalizePath(location.pathname)

    if (previousPath !== currentPath) {
      const isDeeperRoute = getDepth(currentPath) > getDepth(previousPath)
      const isParentToChild =
        currentPath.startsWith(`${previousPath}/`) &&
        getDepth(currentPath) > getDepth(previousPath)
      const isSiblingRoute =
        getDepth(currentPath) === getDepth(previousPath) &&
        getParentPath(currentPath) === getParentPath(previousPath)

      if (isDeeperRoute || isParentToChild || isSiblingRoute) {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    }

    previousPathRef.current = currentPath
  }, [location.pathname])
}
