/**
 * Cấu hình route tập trung — thêm/xóa route chỉ cần sửa file này.
 * Dùng React.lazy cho từng trang để tách chunk, dễ maintain.
 */
import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

import StudentLayout from '../layouts/StudentLayout'
import RecruiterLayout from '../layouts/RecruiterLayout'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { useAuth } from '../contexts/AuthContext'

// Common
const HomePage = lazy(() => import('../pages/Common/HomePage'))
const ProfilePage = lazy(() => import('../pages/Common/ProfilePage'))

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

function PageFallback() {
  return (
    <div
      style={{
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9ca3af',
      }}
    >
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
      : ROUTES.RECRUITER_DASHBOARD
    : ROUTES.HOME
  return <Navigate to={to} replace />
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Common — không qua layout */}
        <Route path={ROUTES.HOME} element={<HomePage />} />

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
          <Route path="profile" element={<ProfilePage />} />
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
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Trang không tồn tại → redirect theo auth */}
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </Suspense>
  )
}
