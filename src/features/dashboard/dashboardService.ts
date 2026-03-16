import { API_ENDPOINTS } from '../../constants/api'
import { apiGet } from '../../services/httpClient'
import type { RecruiterDashboardStats, StudentDashboardStats } from '../../types/domain'

export function getStudentDashboardStats() {
  return apiGet<StudentDashboardStats>(API_ENDPOINTS.DASHBOARD_STUDENT)
}

export function getRecruiterDashboardStats() {
  return apiGet<RecruiterDashboardStats>(API_ENDPOINTS.DASHBOARD_RECRUITER)
}
