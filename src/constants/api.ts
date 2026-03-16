/**
 * API endpoints — base URL đã cấu hình trong .env (VITE_API_BASE_URL, thường là http://localhost:3000/api)
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_ME: '/auth/me',

  // Jobs (public + recruiter + student save)
  JOBS_LIST: '/jobs',
  JOBS_DETAIL: (id: string) => `/jobs/${id}`,
  JOBS_MY_LIST: '/jobs/my/list',
  JOBS_CREATE: '/jobs',
  JOBS_UPDATE: (id: string) => `/jobs/${id}`,
  JOBS_DELETE: (id: string) => `/jobs/${id}`,
  JOBS_STATS: (id: string) => `/jobs/${id}/stats`,
  JOBS_TRACK_VIEW: (id: string) => `/jobs/${id}/view`,
  JOBS_SAVE: (id: string) => `/jobs/${id}/save`,

  // Applications (student apply + recruiter list/detail)
  APPLICATIONS_ME: '/applications/me',
  APPLICATIONS_CREATE: '/applications',
  APPLICATIONS_BY_JOB: (jobId: string) => `/applications/by-job/${jobId}`,
  APPLICATIONS_BY_JOB_APPLICANT: (jobId: string, applicantId: string) =>
    `/applications/by-job/${jobId}/${applicantId}`,
  APPLICATIONS_UPDATE_STATUS: (id: string) => `/applications/${id}`,
  APPLICATIONS_REJECT_SELF: (id: string) => `/applications/${id}/reject-self`,

  // CVs (student)
  CVS_ME: '/cvs/me',
  CVS_CREATE: '/cvs',
  CVS_UPDATE: (id: string) => `/cvs/${id}`,
  CVS_DELETE: (id: string) => `/cvs/${id}`,

  // Profile (student & recruiter)
  PROFILE_ME: '/profile/me',
  PROFILE_SAVE: '/profile/me',

  // Saved jobs
  SAVED_JOBS_ME: '/saved-jobs/me',

  // Notifications
  NOTIFICATIONS_ME: '/notifications/me',
  NOTIFICATIONS_READ: (id: string) => `/notifications/${id}/read`,

  // Dashboards
  DASHBOARD_STUDENT: '/dashboard/student',
  DASHBOARD_RECRUITER: '/dashboard/recruiter',
} as const
