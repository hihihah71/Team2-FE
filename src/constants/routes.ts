/**
 * Đường dẫn route — dùng cho Link, useNavigate, redirect.
 * Cấu hình Route thực tế nằm ở src/routes/index.tsx (nested + lazy load).
 */
export const ROUTES = {
  HOME: '/',

  // Student (người xin việc)
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_JOBS: '/student/jobs',
  STUDENT_JOB_DETAIL: '/student/jobs/:jobId',
  STUDENT_MY_JOBS: '/student/my-jobs', // đã apply / đã lưu
  STUDENT_CV: '/student/cv',
  STUDENT_PROFILE: '/student/profile',

  // Recruiter (nhà tuyển dụng)
  RECRUITER_DASHBOARD: '/recruiter/dashboard',
  RECRUITER_JOBS: '/recruiter/jobs',
  RECRUITER_JOB_DETAIL: '/recruiter/jobs/:jobId', // danh sách ứng viên 1 bài đăng
  RECRUITER_JOB_CREATE: '/recruiter/jobs/new',
  RECRUITER_JOB_EDIT: '/recruiter/jobs/:jobId/edit',
  RECRUITER_JOB_STATS: '/recruiter/jobs/:jobId/stats',
  RECRUITER_APPLICANT_CV: '/recruiter/jobs/:jobId/applicants/:applicantId',
  RECRUITER_PROFILE: '/recruiter/profile',
} as const

export type AppRouteKey = keyof typeof ROUTES

