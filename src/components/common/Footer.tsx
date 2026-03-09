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

                {/* Row 2: Apps & Socials */}
                <div className="footer-middle">
                    <div className="footer-apps">
                        <h4 className="footer-app-title">Tải ứng dụng ngay</h4>
                        <div className="app-download-area">
                            <div className="qr-code">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://cvplatform.vn/download" alt="QR Code" />
                            </div>
                            <div className="app-buttons">
                                <a href="#" className="app-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.36 14c.08-.02.14-.02.22-.04.14-.04.28-.1.4-.18.42-.32.68-.82.68-1.34V7.5c0-.66-.28-1.28-.76-1.74A2.454 2.454 0 0 0 15.18 5c-.66 0-1.28.28-1.74.76-.46.46-.74 1.08-.74 1.74v4.94c0 .52.26 1.02.68 1.34.12.08.26.14.4.18.08.02.14.02.22.04.18.04.38.04.58.04H16.36zm-1.84-6.5c0-.28.12-.54.32-.74.2-.2.46-.32.74-.32.28 0 .54.12.74.32.2.2.32.46.32.74v4.94c0 .28-.12.54-.32.74-.2.2-.46.32-.74.32-.28 0-.54-.12-.74-.32-.2-.2-.32-.46-.32-.74V7.5zM7.5 7.5v4.94c0 .52.26 1.02.68 1.34.12.08.26.14.4.18.08.02.14.02.22.04.18.04.38.04.58.04H10.8c.66 0 1.28-.28 1.74-.76.46-.46.74-1.08.74-1.74V7.5c0-.66-.28-1.28-.76-1.74A2.454 2.454 0 0 0 10.8 5H9.3c-.66 0-1.28.28-1.74.76-.46.46-.74 1.08-.74 1.74zm1.84.0c0-.28.12-.54.32-.74.2-.2.46-.32.74-.32H10.8c.28 0 .54.12.74.32.2.2.32.46.32.74v4.94c0 .28-.12.54-.32.74-.2.2-.46.32-.74.32H9.3c-.28 0-.54-.12-.74-.32C8.42 12.98 8.3 12.72 8.3 12.44V7.5H9.34z" /><path d="M19 1H5C2.8 1 1 2.8 1 5v14c0 2.2 1.8 4 4 4h14c2.2 0 4-1.8 4-4V5c0-2.2-1.8-4-4-4zm-4.42 15.54c-.58.12-1.18.18-1.8.18H10.8c-.84 0-1.64-.18-2.38-.5A5.858 5.858 0 0 1 5.28 12.2a5.858 5.858 0 0 1-1.38-3.66V7.5c0-2.2 1.78-4 4-4H9.3c1.5 0 2.88.84 3.58 2.14.3.56.46 1.18.46 1.84v4.94c0 1.28-.74 2.4-1.86 3.02C12.48 15.02 11.66 15 10.8 15h1.98c.52 0 1.02-.06 1.5-.18.96-.24 1.8-.78 2.42-1.52A5.858 5.858 0 0 0 18.28 10a5.858 5.858 0 0 0 1.38 3.66c-.66 1.48-1.92 2.66-3.44 3.12l-1.64-.24z" /></svg>
                                    <div className="btn-text">
                                        <span className="btn-small">Tải trên</span>
                                        <span className="btn-large">App Store</span>
                                    </div>
                                </a>
                                <a href="#" className="app-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
                                    <div className="btn-text">
                                        <span className="btn-small">Tải trên</span>
                                        <span className="btn-large">Google Play</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-socials">
                        <h4 className="footer-social-title">Kết nối với chúng tôi</h4>
                        <div className="social-icons">
                            <a href="#" className="social-link" title="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </a>
                            <a href="#" className="social-link" title="LinkedIn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                            <a href="#" className="social-link" title="TikTok">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                            </a>
                            <a href="#" className="social-link" title="YouTube">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                            </a>
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
