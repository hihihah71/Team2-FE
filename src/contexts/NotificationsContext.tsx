import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import {
  getMyNotifications,
  markNotificationRead,
} from '../features/notifications/notificationsService'
import type { NotificationItem } from '../types/domain'

const POLL_INTERVAL = 15_000

type NotificationsContextValue = {
  items: NotificationItem[]
  unreadCount: number
  loading: boolean
  refresh: () => Promise<void>
  markOneRead: (notificationId: string) => Promise<void>
  markAllRead: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)
  const isFirstLoad = useRef(true)

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([])
      return
    }
    if (isFirstLoad.current) {
      setLoading(true)
      isFirstLoad.current = false
    }
    try {
      const data = await getMyNotifications()
      setItems(data)
    } finally {
      setLoading(false)
    }
  }, [user])

  const markOneRead = useCallback(async (notificationId: string) => {
    const updated = await markNotificationRead(notificationId)
    setItems((prev) =>
      prev.map((item) => (item._id === notificationId ? updated : item)),
    )
  }, [])

  const markAllRead = useCallback(async () => {
    const unread = items.filter((item) => !item.isRead)
    await Promise.all(unread.map((item) => markNotificationRead(item._id)))
    setItems((prev) => prev.map((item) => ({ ...item, isRead: true })))
  }, [items])

  useEffect(() => {
    refresh().catch(() => undefined)

    const id = window.setInterval(() => {
      refresh().catch(() => undefined)
    }, POLL_INTERVAL)

    return () => window.clearInterval(id)
  }, [refresh])

  const value = useMemo<NotificationsContextValue>(
    () => ({
      items,
      unreadCount: items.filter((item) => !item.isRead).length,
      loading,
      refresh,
      markOneRead,
      markAllRead,
    }),
    [items, loading, markAllRead, markOneRead, refresh],
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export { NotificationsContext }
