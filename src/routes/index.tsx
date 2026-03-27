/**
 * Cấu hình route tập trung — thêm/xóa route chỉ cần sửa file này.
 * Dùng React.lazy cho từng trang để tách chunk, dễ maintain.
 */
import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

import StudentLayout from '../layouts/StudentLayout'
import RecruiterLayout from '../layouts/RecruiterLayout'
import AdminLayout from '../layouts/AdminLayout'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { useAuth } from '../contexts/AuthContext'

// Common
const HomePage = lazy(() => import('../pages/Common/HomePage'))
const ProfilePage = lazy(() => import('../pages/Common/ProfilePage'))
const NotificationsPage = lazy(() => import('../pages/Common/NotificationsPage'))
const PublicCVPage = lazy(() => import('../pages/Common/PublicCVPage'))

// Student
const StudentDashboardPage = lazy(() => import('../pages/Student/StudentDashboardPage'))
const StudentJobsPage = lazy(() => import('../pages/Student/StudentJobsPage'))
const StudentJobDetailPage = lazy(() => import('../pages/Student/StudentJobDetailPage'))
const StudentMyJobsPage = lazy(() => import('../pages/Student/StudentMyJobsPage'))
const StudentCVPage = lazy(() => import('../pages/Student/StudentCVPage'))

// Recruiter
const RecruiterDashboardPage = lazy(() => import('../pages/Recruiter/RecruiterDashboardPage'))
const RecruiterJobsPage = lazy(() => import('../pages/Recruiter/RecruiterJobsPage'))
const RecruiterJobDetailPage = lazy(() => import('../pages/Recruiter/RecruiterJobDetailPage'))
const RecruiterJobFormPage = lazy(() => import('../pages/Recruiter/RecruiterJobFormPage'))
const RecruiterJobStatsPage = lazy(() => import('../pages/Recruiter/RecruiterJobStatsPage'))
const RecruiterApplicantCVPage = lazy(() => import('../pages/Recruiter/RecruiterApplicantCVPage'))
const RecruiterBrowseJobsPage = lazy(() => import('../pages/Recruiter/RecruiterBrowseJobsPage'))
const RecruiterBrowseJobDetailPage = lazy(() => import('../pages/Recruiter/RecruiterBrowseJobDetailPage'))

// Admin
const AdminLoginPage = lazy(() => import('../pages/Admin/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('../pages/Admin/AdminDashboardPage'))
const AdminUsersPage = lazy(() => import('../pages/Admin/AdminUsersPage'))
const AdminRecruitersPage = lazy(() => import('../pages/Admin/AdminRecruitersPage'))
const AdminJobsPage = lazy(() => import('../pages/Admin/AdminJobsPage'))
const AdminJobDetailPage = lazy(() => import('../pages/Admin/AdminJobDetailPage'))
const AdminReportsPage = lazy(() => import('../pages/Admin/AdminReportsPage'))

function PageFallback() {
  return (
    <div
      style={{
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9ca3af',
        animation: 'page-fallback-pulse 1.5s ease-in-out infinite',
      }}
    >
      <style>{`
        @keyframes page-fallback-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
      Đang tải...
    </div>
  )
}

/** Trang không tồn tại: chưa đăng nhập → home, đã đăng nhập → dashboard theo role */
function NotFoundRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <PageFallback />
  const to = user
    ? user.role === 'student'
      ? ROUTES.STUDENT_DASHBOARD
      : user.role === 'recruiter'
        ? ROUTES.RECRUITER_DASHBOARD
        : ROUTES.ADMIN_DASHBOARD
    : ROUTES.HOME
  return <Navigate to={to} replace />
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Common — không qua layout */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
        <Route path="/public/cv/:slug" element={<PublicCVPage />} />

        {/* Student — nested under /student, bảo vệ: chỉ role student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={ROUTES.STUDENT_DASHBOARD} replace />} />
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="jobs" element={<StudentJobsPage />} />
          <Route path="jobs/:jobId" element={<StudentJobDetailPage />} />
          <Route path="my-jobs" element={<StudentMyJobsPage />} />
          <Route path="cv" element={<StudentCVPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="recruiters" element={<AdminRecruitersPage />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="jobs/:jobId" element={<AdminJobDetailPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
        </Route>

        {/* Recruiter — nested under /recruiter, bảo vệ: chỉ role recruiter */}
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={ROUTES.RECRUITER_DASHBOARD} replace />} />
          <Route path="dashboard" element={<RecruiterDashboardPage />} />
          <Route path="jobs" element={<RecruiterJobsPage />} />
          <Route path="jobs/new" element={<RecruiterJobFormPage />} />
          <Route path="jobs/:jobId/edit" element={<RecruiterJobFormPage />} />
          <Route path="jobs/:jobId/stats" element={<RecruiterJobStatsPage />} />
          <Route path="jobs/:jobId/applicants/:applicantId" element={<RecruiterApplicantCVPage />} />
          <Route path="jobs/:jobId" element={<RecruiterJobDetailPage />} />
          <Route path="browse" element={<RecruiterBrowseJobsPage />} />
          <Route path="browse/:jobId" element={<RecruiterBrowseJobDetailPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Trang không tồn tại → redirect theo auth */}
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </Suspense>
  )
}
