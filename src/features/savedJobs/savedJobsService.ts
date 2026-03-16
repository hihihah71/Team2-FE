import { API_ENDPOINTS } from '../../constants/api'
import { apiGet } from '../../services/httpClient'
import type { JobItem } from '../../types/domain'

export function getMySavedJobs() {
  return apiGet<JobItem[]>(API_ENDPOINTS.SAVED_JOBS_ME)
}
