import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import './Footer.css';

export const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-container">
                {/* Row 1: Main Content */}
                <div className="footer-top">
                    {/* Column 0: Branding */}
                    <div className="footer-brand-col">
                        <Link to={ROUTES.HOME} className="footer-logo">
                            <span className="logo-icon">C</span>
                            <span className="logo-text">CV Platform</span>
                        </Link>
                        <p className="footer-slogan">Nền tảng kết nối sinh viên và nhà tuyển dụng hàng đầu, mở ra hàng ngàn cơ hội nghề nghiệp hấp dẫn.</p>
                        <div className="footer-contact">
                            <div className="contact-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                <span>1900 1234</span>
                            </div>
                            <div className="contact-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                <span>support@cvplatform.vn</span>
                            </div>
                        </div>
                    </div>

                    {/* Nav Columns */}
                    <div className="footer-nav-grid">
                        {/* Column 1: Về nền tảng */}
                        <div className="footer-nav-col">
                            <h4 className="footer-nav-title">Về nền tảng</h4>
                            <ul className="footer-links">
                                <li><Link to="#">Giới thiệu</Link></li>
                                <li><Link to="#">Liên hệ</Link></li>
                                <li><Link to="#">Hỗ trợ khách hàng</Link></li>
                                <li><Link to="#">Chính sách bảo mật</Link></li>
                                <li><Link to="#">Điều khoản sử dụng</Link></li>
                            </ul>
                        </div>

                        {/* Column 2: Sinh viên */}
                        <div className="footer-nav-col">
                            <h4 className="footer-nav-title">Sinh viên</h4>
                            <ul className="footer-links">
                                <li><Link to={ROUTES.STUDENT_JOBS}>Tìm việc part-time</Link></li>
                                <li><Link to={ROUTES.STUDENT_JOBS}>Việc làm trong trường</Link></li>
                                <li><Link to={ROUTES.STUDENT_JOBS}>Thực tập sinh (Intern)</Link></li>
                                <li><Link to={ROUTES.STUDENT_CV}>Tạo CV ngay</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: Công cụ */}
                        <div className="footer-nav-col">
                            <h4 className="footer-nav-title">Công cụ & Bí quyết</h4>
                            <ul className="footer-links">
                                <li><Link to="#">Hướng dẫn viết CV</Link></li>
                                <li><Link to="#">Kỹ năng phỏng vấn</Link></li>
                                <li><Link to="#">Cẩm nang nghề nghiệp</Link></li>
                                <li><Link to="#">Ước tính lương</Link></li>
                            </ul>
                        </div>

                        {/* Column 4: Nhà tuyển dụng */}
                        <div className="footer-nav-col">
                            <h4 className="footer-nav-title">Nhà tuyển dụng</h4>
                            <ul className="footer-links">
                                <li><Link to={ROUTES.RECRUITER_DASHBOARD}>Đăng tin tuyển dụng</Link></li>
                                <li><Link to={ROUTES.RECRUITER_DASHBOARD}>Tìm kiếm ứng viên</Link></li>
                                <li><Link to={ROUTES.RECRUITER_DASHBOARD}>Quản lý chiến dịch</Link></li>
                                <li><Link to="#">Bảng giá dịch vụ</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>


                {/* Row 3: Company Legal & Copyright */}
                <div className="footer-bottom">
                    <div className="company-info">
                        <p><strong>Công ty Cổ phần Nền tảng CV Platform Việt Nam</strong></p>
                        <p>Địa chỉ: Tầng 6, Tòa nhà Innovation, Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội</p>
                        <p>Giấy phép kinh doanh số: 0101234567 do Sở KHĐT TP Hà Nội cấp ngày 01/01/2026</p>
                    </div>
                    <div className="copyright">
                        <p>© 2026 Student Job Platform. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
