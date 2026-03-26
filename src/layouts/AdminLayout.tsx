import { NavLink, Outlet } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../contexts/AuthContext'
import '../pages/PageUI.css'

const AdminLayout = () => {
  const { logout } = useAuth()

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '260px 1fr', background: '#020617' }}>
      <aside style={{ borderRight: '1px solid rgba(148,163,184,0.2)', padding: '20px', background: 'rgba(2,6,23,0.75)' }}>
        <h3 style={{ color: '#e2e8f0', marginTop: 0, marginBottom: '14px' }}>Bảng điều khiển Admin</h3>
        <nav style={{ display: 'grid', gap: '8px' }}>
          <NavLink to={ROUTES.ADMIN_DASHBOARD} className={({ isActive }) => `page-ui__btn ${isActive ? 'page-ui__btn--primary' : 'page-ui__btn--secondary'}`}>Tổng quan</NavLink>
          <NavLink to={ROUTES.ADMIN_USERS} className={({ isActive }) => `page-ui__btn ${isActive ? 'page-ui__btn--primary' : 'page-ui__btn--secondary'}`}>Người dùng</NavLink>
          <NavLink to={ROUTES.ADMIN_RECRUITERS} className={({ isActive }) => `page-ui__btn ${isActive ? 'page-ui__btn--primary' : 'page-ui__btn--secondary'}`}>Nhà tuyển dụng</NavLink>
          <NavLink to={ROUTES.ADMIN_JOBS} className={({ isActive }) => `page-ui__btn ${isActive ? 'page-ui__btn--primary' : 'page-ui__btn--secondary'}`}>Bài đăng</NavLink>
          <NavLink to={ROUTES.ADMIN_REPORTS} className={({ isActive }) => `page-ui__btn ${isActive ? 'page-ui__btn--primary' : 'page-ui__btn--secondary'}`}>Báo cáo</NavLink>
        </nav>
        <button onClick={logout} className="page-ui__btn page-ui__btn--danger" style={{ marginTop: '16px', width: '100%' }}>Đăng xuất</button>
      </aside>
      <main className="page-ui" style={{ padding: '20px' }}>
        <div className="page-ui__container" style={{ margin: 0, maxWidth: '1200px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
