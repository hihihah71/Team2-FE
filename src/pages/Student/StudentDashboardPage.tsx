import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../contexts/AuthContext';
import './StudentDashboardPage.css';

const StudentDashboardPage = () => {
  const { user } = useAuth();

  const userProfile = {
    name: user?.fullName || 'Sinh Viên',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'Sinh Vien')}&background=3b82f6&color=fff`,
  };

  const activityData = {
    applied: 12,
    interviews: 2,
    saved: 8,
    recentStatus: 'Đã xem CV'
  };

  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Tuyển dụng Part-time & Thực tập sinh',
      subtitle: 'Hàng ngàn cơ hội việc làm hấp dẫn dành cho sinh viên'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Chương trình Job Fair 2026',
      subtitle: 'Kết nối trực tiếp với nhà tuyển dụng ngay tại khuôn viên trường'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Tuyển Cộng tác viên Mùa hè',
      subtitle: 'Trau dồi kỹ năng mềm và mở rộng mối quan hệ'
    }
  ];

  const originalPartTimeJobs = [
    {
      id: 101,
      title: 'Nhân viên Phục vụ Cà phê',
      company: 'The Coffee House',
      logo: 'https://ui-avatars.com/api/?name=TC&background=f97316&color=fff',
      location: 'Quận Cầu Giấy',
      wage: '25k - 30k / giờ',
      type: 'Part-time',
      time: 'Ca linh hoạt'
    },
    {
      id: 102,
      title: 'Trợ giảng Tiếng Anh',
      company: 'IELTS Fighter',
      logo: 'https://ui-avatars.com/api/?name=IF&background=ef4444&color=fff',
      location: 'Quận Đống Đa',
      wage: '50k - 80k / giờ',
      type: 'Part-time',
      time: 'Ca tối / Cuối tuần'
    },
    {
      id: 103,
      title: 'Nhân viên Bán hàng',
      company: 'Circle K',
      logo: 'https://ui-avatars.com/api/?name=CK&background=ef4444&color=fff',
      location: 'Gần trường (500m)',
      wage: '22k - 25k / giờ',
      type: 'Theo ca',
      time: 'Ca sáng / Ca chiều'
    },
    {
      id: 104,
      title: 'Cộng tác viên Sự kiện',
      company: 'VNEvents',
      logo: 'https://ui-avatars.com/api/?name=VE&background=10b981&color=fff',
      location: 'Linh hoạt',
      wage: '100k - 150k / buổi',
      type: 'Ngắn hạn',
      time: 'Cuối tuần'
    }
  ];

  // Generate more mock jobs for pagination testing (total 35 jobs)
  const partTimeJobs = Array.from({ length: 35 }).map((_, i) => ({
    ...originalPartTimeJobs[i % 4],
    id: 1000 + i,
    title: `${originalPartTimeJobs[i % 4].title} - Vị trí ${i + 1}`,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  // Calculate pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = partTimeJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(partTimeJobs.length / jobsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Smooth scroll back to top of the job section
    window.scrollTo({
      top: 600,
      behavior: 'smooth'
    });
  };

  const nearbyJobs = [
    {
      id: 201,
      title: 'Thực tập sinh Marketing',
      company: 'TechCorp Vietnam',
      logo: 'https://ui-avatars.com/api/?name=TV&background=3b82f6&color=fff',
      location: 'Cách 1.2km',
      wage: '3 - 5 triệu / tháng',
      type: 'Intern',
      time: 'Bán thời gian'
    },
    {
      id: 202,
      title: 'Hỗ trợ kỹ thuật phòng Lab',
      company: 'Trường Đại học',
      logo: 'https://ui-avatars.com/api/?name=DH&background=8b5cf6&color=fff',
      location: 'Trong khuôn viên',
      wage: '30k / giờ',
      type: 'Trong trường',
      time: 'Theo ca đăng ký'
    },
    {
      id: 203,
      title: 'Giao hàng - Shipper nội thành',
      company: 'Ahamove',
      logo: 'https://ui-avatars.com/api/?name=AH&background=f59e0b&color=fff',
      location: 'Bán kính 3km',
      wage: 'Tùy năng lực',
      type: 'Part-time',
      time: 'Thời gian tự do'
    }
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const JobCard = ({ job }: { job: any }) => (
    <div className="discovery-job-card">
      <div className="job-card-left">
        <img src={job.logo} alt={job.company} className="job-logo" />
        <button className="save-btn" title="Lưu công việc">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        </button>
      </div>
      <div className="job-card-right">
        <h3 className="job-title" title={job.title}>{job.title}</h3>
        <p className="job-company" title={job.company}>{job.company}</p>
        <div className="job-details">
          <span className="job-detail-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {job.location}
          </span>
          <span className="job-detail-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            {job.wage}
          </span>
        </div>
        <div className="job-tags">
          <span className="job-tag tag-type">{job.type}</span>
          <span className="job-tag tag-time">{job.time}</span>
          <div className="job-actions">
            <Link to={`${ROUTES.STUDENT_JOBS}/${job.id}`} className="job-apply-btn">Xem chi tiết</Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="student-discovery-container">
      {/* 1. Header & Activity Widget Inline */}
      <div className="top-section">
        <div className="welcome-header">
          <h1>Chào buổi sáng, {userProfile.name}! 🚀</h1>
          <p>Hôm nay có hàng chục công việc part-time & thực tập mới đang chờ bạn khám phá.</p>
        </div>

        <div className="activity-widget">
          <Link to={ROUTES.STUDENT_MY_JOBS} className="activity-stat" style={{ textDecoration: 'none' }}>
            <span className="stat-num">{activityData.applied}</span>
            <span className="stat-label">Đã ứng tuyển</span>
          </Link>
          <div className="stat-divider"></div>
          <Link to={ROUTES.STUDENT_MY_JOBS} className="activity-stat" style={{ textDecoration: 'none' }}>
            <span className="stat-num text-purple">{activityData.interviews}</span>
            <span className="stat-label">Phỏng vấn</span>
          </Link>
          <div className="stat-divider"></div>
          <Link to={ROUTES.STUDENT_MY_JOBS} className="activity-stat" style={{ textDecoration: 'none' }}>
            <span className="stat-num text-green">{activityData.saved}</span>
            <span className="stat-label">Đã lưu</span>
          </Link>
          <div className="activity-status">
            <span className="status-dot blink"></span> 1 NTD {activityData.recentStatus}
          </div>
        </div>
      </div>

      {/* 2. Banner Slider & Search */}
      <div className="hero-section">
        <div className="banner-slider">
          {banners.map((banner, idx) => (
            <div
              key={banner.id}
              className={`banner-slide ${idx === currentBanner ? 'active' : ''}`}
            >
              <img src={banner.image} alt={banner.title} className="banner-bg" />
              <div className="banner-overlay"></div>
              <div className="banner-content">
                <span className="banner-badge">Hot</span>
                <h2>{banner.title}</h2>
                <p>{banner.subtitle}</p>
                <Link to={ROUTES.STUDENT_JOBS} className="banner-btn" style={{ textDecoration: 'none' }}>Khám phá ngay</Link>
              </div>
            </div>
          ))}
          <div className="slider-dots">
            {banners.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === currentBanner ? 'active' : ''}`}
                onClick={() => setCurrentBanner(idx)}
              ></span>
            ))}
          </div>
        </div>

        <div className="search-bar-wrapper">
          <div className="search-bar-container">
            <div className="search-inputs">
              <div className="search-group search-keyword">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Tìm việc part-time, trợ giảng..." />
              </div>
              <div className="search-group search-location">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <select defaultValue="">
                  <option value="">Tất cả khu vực</option>
                  <option value="campus">Mọi nơi trong trường</option>
                  <option value="near">Gần trường nhất</option>
                </select>
              </div>
              <div className="search-group search-type">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <select defaultValue="">
                  <option value="">Lọc theo tính chất</option>
                  <option value="part-time">Việc làm Part-time</option>
                  <option value="shift">Làm việc theo ca</option>
                  <option value="weekend">Việc làm cuối tuần</option>
                  <option value="intern">Thực tập sinh (Intern)</option>
                </select>
              </div>
            </div>
            <button className="search-btn">Tìm việc</button>
          </div>
        </div>
      </div>

      {/* 3. Job Sections */}
      <div className="content-sections">
        {/* Part-time Nổi bật */}
        <section className="job-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">🔥 Việc làm Part-time Nổi bật</h2>
              <p className="section-desc">Cơ hội việc làm thêm thu nhập phù hợp với lịch học, được ứng tuyển nhiều nhất tuần qua.</p>
            </div>
            <Link to={ROUTES.STUDENT_JOBS} className="see-all-btn">Xem tất cả</Link>
          </div>
          <div className="job-cards-grid">
            {currentJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trang trước
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    className={`pagination-number ${currentPage === idx + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Trang sau
              </button>
            </div>
          )}
        </section>

        {/* Horizontal Promo Banner 1: Profile Update */}
        <div className="promo-horizontal-banner style-profile">
          <div className="promo-content">
            <h3>🚀 Mở khóa cơ hội việc làm tốt nhất!</h3>
            <p>Sinh viên có hồ sơ đầy đủ nhận được lượng phản hồi từ nhà tuyển dụng cao gấp 3 lần. Dành 5 phút để cập nhật hồ sơ ngay.</p>
          </div>
          <div className="promo-action">
            <Link to={ROUTES.STUDENT_PROFILE} className="promo-btn">Cập nhật hồ sơ</Link>
          </div>
        </div>

        {/* Việc làm gần bạn & Việc trong trường */}
        <section className="job-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">📍 Việc làm Tận nơi / Gần bạn</h2>
              <p className="section-desc">Tiết kiệm chi phí và thời gian đi lại, dễ dành sắp xếp cùng lịch học.</p>
            </div>
            <Link to={ROUTES.STUDENT_JOBS} className="see-all-btn">Xem tất cả</Link>
          </div>
          <div className="job-cards-grid">
            {nearbyJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}

            <div className="explore-more-card">
              <div className="explore-icon">🗺️</div>
              <h3>Tìm quanh trường</h3>
              <p>Khám phá bản đồ việc làm xung quanh khuôn viên và khu trọ.</p>
              <Link to={ROUTES.STUDENT_JOBS} className="explore-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Mở bản đồ</Link>
            </div>
          </div>
        </section>

        {/* Horizontal Promo Banner 2: Event/Workshop */}
        <div className="promo-horizontal-banner style-event">
          <div className="promo-content">
            <h3>🎉 Workshop: Bí quyết vượt qua vòng CV</h3>
            <p>Tham gia buổi chia sẻ trực tuyến cùng anh chị HR từ các tập đoàn lớn. Độc quyền và miễn phí dành riêng cho sinh viên trường mình.</p>
          </div>
          <div className="promo-action">
            <Link to={ROUTES.STUDENT_JOBS} className="promo-btn btn-secondary">Đăng ký giữ chỗ</Link>
          </div>
        </div>

        {/* Việc phù hợp / Công việc mới */}
        <section className="job-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">✨ Gợi ý Phù hợp & Việc Mới ra lò</h2>
              <p className="section-desc">Dựa trên chuyên ngành và thời gian rảnh bạn đã thiết lập trong hồ sơ.</p>
            </div>
            <Link to={ROUTES.STUDENT_PROFILE} className="update-profile-link">Cập nhật hồ sơ để gợi ý tốt hơn</Link>
          </div>
          <div className="job-cards-grid">
            {[
              { ...nearbyJobs[0], id: 301, title: 'Thực tập sinh Lập trình Web', company: 'FPT Software', logo: 'https://ui-avatars.com/api/?name=FPT&background=f97316&color=fff' },
              { ...partTimeJobs[1], id: 302, title: 'Trợ giảng Tin học', company: 'MindX', logo: 'https://ui-avatars.com/api/?name=MX&background=ef4444&color=fff', wage: '60k - 100k / giờ' },
              { ...partTimeJobs[3], id: 303, title: 'Hỗ trợ Tổ chức Sự kiện IT', company: 'TechAsia', logo: 'https://ui-avatars.com/api/?name=TA&background=3b82f6&color=fff', location: 'Trần Duy Hưng', wage: '250k / ngày' },
              { ...partTimeJobs[2], id: 304, title: 'Cộng tác viên Bán Giày Thể Thao', company: 'SneakerBuzz', logo: 'https://ui-avatars.com/api/?name=SB&background=0ea5e9&color=fff', location: 'Aeon Mall', wage: 'Lương CB + TT' }
            ].map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboardPage;