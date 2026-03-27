import { API_ENDPOINTS } from '../../constants/api'
import { apiPost } from '../../services/httpClient'

export function createReport(payload: {
  targetType: 'job' | 'recruiter'
  targetId: string
  reason: string
}) {
  return apiPost(API_ENDPOINTS.REPORTS_CREATE, payload)
}
