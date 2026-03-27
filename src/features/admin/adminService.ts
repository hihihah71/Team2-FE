import { API_ENDPOINTS } from '../../constants/api'
import { apiDelete, apiGet, apiPatch } from '../../services/httpClient'

export const getAdminOverview = () => apiGet<{
  totalUsers: number
  totalRecruiters: number
  totalJobs: number
  totalReports: number
  flaggedJobs: number
}>(API_ENDPOINTS.ADMIN_OVERVIEW)

export const getAdminRecruiters = (status = 'pending') =>
  apiGet<any[]>(`${API_ENDPOINTS.ADMIN_RECRUITERS}?status=${status}`)
export const approveRecruiter = (userId: string) => apiPatch(API_ENDPOINTS.ADMIN_RECRUITER_APPROVE(userId), {})
export const rejectRecruiter = (userId: string, reason?: string) =>
  apiPatch(API_ENDPOINTS.ADMIN_RECRUITER_REJECT(userId), { reason: reason || '' })

export const getAdminUsers = (role?: string) =>
  apiGet<any[]>(`${API_ENDPOINTS.ADMIN_USERS}${role ? `?role=${role}` : ''}`)
export const banUserAdmin = (userId: string, reason?: string) =>
  apiPatch(API_ENDPOINTS.ADMIN_USER_BAN(userId), { reason: reason || '' })
export const unbanUserAdmin = (userId: string) => apiPatch(API_ENDPOINTS.ADMIN_USER_UNBAN(userId), {})

export const getAdminJobs = (status?: string) =>
  apiGet<any[]>(`${API_ENDPOINTS.ADMIN_JOBS}${status ? `?status=${status}` : ''}`)
export const getAdminJobDetail = (jobId: string) => apiGet<any>(API_ENDPOINTS.ADMIN_JOB_DETAIL(jobId))
export const approveJobAdmin = (jobId: string) => apiPatch(API_ENDPOINTS.ADMIN_JOB_APPROVE(jobId), {})
export const rejectJobAdmin = (jobId: string) => apiPatch(API_ENDPOINTS.ADMIN_JOB_REJECT(jobId), {})
export const flagJobAdmin = (jobId: string) => apiPatch(API_ENDPOINTS.ADMIN_JOB_FLAG(jobId), {})
export const banJobAdmin = (jobId: string) => apiPatch(API_ENDPOINTS.ADMIN_JOB_BAN(jobId), {})
export const deleteJobAdmin = (jobId: string) => apiDelete(API_ENDPOINTS.ADMIN_JOB_DELETE(jobId))

export const getAdminReports = (status?: string) =>
  apiGet<any[]>(`${API_ENDPOINTS.ADMIN_REPORTS}${status ? `?status=${status}` : ''}`)
export const resolveReportAdmin = (reportId: string) => apiPatch(API_ENDPOINTS.ADMIN_REPORT_RESOLVE(reportId), {})
