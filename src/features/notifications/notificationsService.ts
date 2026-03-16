import { API_ENDPOINTS } from '../../constants/api'
import { apiGet, apiPatch } from '../../services/httpClient'
import type { NotificationItem } from '../../types/domain'

export function getMyNotifications() {
  return apiGet<NotificationItem[]>(API_ENDPOINTS.NOTIFICATIONS_ME)
}

export function markNotificationRead(notificationId: string) {
  return apiPatch<NotificationItem>(API_ENDPOINTS.NOTIFICATIONS_READ(notificationId), {})
}
