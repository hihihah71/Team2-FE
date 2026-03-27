/**
 * API endpoints — base URL đã cấu hình trong .env (VITE_API_BASE_URL, thường là http://localhost:3000/api)
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_ME: '/auth/me',
  AUTH_GOOGLE: '/auth/google',
  AUTH_REQUEST_VERIFICATION: '/auth/request-verification',
  AUTH_VERIFY_ACCOUNT: '/auth/verify-account',

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
  CVS_PUBLIC: (slug: string) => `/cvs/public/${slug}`,
  CVS_CLONE_VERSION: (id: string) => `/cvs/${id}/versions`,
  CVS_UPDATE: (id: string) => `/cvs/${id}`,
  CVS_DELETE: (id: string) => `/cvs/${id}`,

  // AI
  AI_OPTIMIZE: '/ai/optimize',
  AI_ANALYZE_JOB: '/ai/analyze-job',
  AI_TAILOR: '/ai/tailor',
  AI_INTERVIEW_PREP: '/ai/interview-prep',

  // Profile (student & recruiter)
  PROFILE_ME: '/profile/me',
  PROFILE_SAVE: '/profile/me',
  PROFILE_RECRUITER_VERIFICATION_REQUEST: '/profile/verify-recruiter',

  // Saved jobs
  SAVED_JOBS_ME: '/saved-jobs/me',

  // Notifications
  NOTIFICATIONS_ME: '/notifications/me',
  NOTIFICATIONS_READ: (id: string) => `/notifications/${id}/read`,

  // Dashboards
  DASHBOARD_STUDENT: '/dashboard/student',
  DASHBOARD_RECRUITER: '/dashboard/recruiter',

  // Reports
  REPORTS_CREATE: '/reports',

  // Admin
  ADMIN_OVERVIEW: '/admin/overview',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_BAN: (userId: string) => `/admin/users/${userId}/ban`,
  ADMIN_USER_UNBAN: (userId: string) => `/admin/users/${userId}/unban`,
  ADMIN_RECRUITERS: '/admin/recruiters',
  ADMIN_RECRUITER_APPROVE: (userId: string) => `/admin/recruiters/${userId}/approve`,
  ADMIN_RECRUITER_REJECT: (userId: string) => `/admin/recruiters/${userId}/reject`,
  ADMIN_JOBS: '/admin/jobs',
  ADMIN_JOB_DETAIL: (jobId: string) => `/admin/jobs/${jobId}`,
  ADMIN_JOB_APPROVE: (jobId: string) => `/admin/jobs/${jobId}/approve`,
  ADMIN_JOB_REJECT: (jobId: string) => `/admin/jobs/${jobId}/reject`,
  ADMIN_JOB_FLAG: (jobId: string) => `/admin/jobs/${jobId}/flag`,
  ADMIN_JOB_BAN: (jobId: string) => `/admin/jobs/${jobId}/ban`,
  ADMIN_JOB_DELETE: (jobId: string) => `/admin/jobs/${jobId}`,
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_REPORT_RESOLVE: (reportId: string) => `/admin/reports/${reportId}/resolve`,
} as const
