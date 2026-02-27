
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Common/HomePage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import StudentDashboardPage from './pages/Student/StudentDashboardPage'
import { ROUTES } from './constants/routes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.STUDENT_DASHBOARD} element={<StudentDashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
