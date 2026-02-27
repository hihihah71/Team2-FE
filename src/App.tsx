

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Common/HomePage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import StudentDashboardPage from './pages/Student/StudentDashboardPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
