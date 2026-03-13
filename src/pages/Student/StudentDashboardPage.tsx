import { apiGet, apiPost } from "../../services/httpClient";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";
import "./StudentDashboardPage.css";

type Job = {
  _id: string;
  title: string;
  company?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  logo?: string;
};

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 12;

  const banners = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      title: "Tuyển dụng Part-time & Thực tập sinh",
      subtitle: "Hàng ngàn cơ hội việc làm hấp dẫn dành cho sinh viên",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
      title: "Chương trình Job Fair 2026",
      subtitle: "Kết nối trực tiếp với nhà tuyển dụng",
    },
  ];

  /* ---------------- FETCH JOBS ---------------- */

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data: any = await apiGet("/jobs");

        const jobList = data?.items || data?.jobs || data || [];

        if (Array.isArray(jobList)) {
          setJobs(jobList);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setJobs([]);
      }
    };

    fetchJobs();
  }, []);

  /* ---------------- BANNER SLIDER ---------------- */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  /* ---------------- PAGINATION ---------------- */

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 500,
      behavior: "smooth",
    });
  };

  /* ---------------- VIEW JOB ---------------- */

  const handleViewJob = async (jobId: string) => {
    try {
      await apiPost(`/jobs/${jobId}/view`, {});
    } catch (err) {
      console.error("View update failed", err);
    }

    navigate(`/student/jobs/${jobId}`);
  };

  /* ---------------- JOB CARD ---------------- */

  const JobCard = ({ job }: { job: Job }) => (
    <div className="discovery-job-card">
      <div className="job-card-left">
        <img
          src={
            job.logo ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              job.company || "Company"
            )}&background=3b82f6&color=fff`
          }
          alt={job.company}
          className="job-logo"
        />
      </div>

      <div className="job-card-right">
        <h3 className="job-title">{job.title}</h3>

        <p className="job-company">{job.company || "Company"}</p>

        <div className="job-details">
          <span className="job-detail-item">
            📍 {job.location || "Không rõ địa điểm"}
          </span>

          <span className="job-detail-item">
            💰 {job.salaryMin || "?"} - {job.salaryMax || "?"}
          </span>
        </div>

        <div className="job-actions">
          <button
            className="view-job-btn"
            onClick={() => handleViewJob(job._id)}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );

  /* ---------------- RENDER ---------------- */

  return (
    <div className="student-discovery-container">
      <div className="top-section">
        <div className="welcome-header">
          <h1>Chào buổi sáng, {user?.fullName || "Sinh Viên"}! 🚀</h1>
          <p>Các công việc mới đang chờ bạn khám phá.</p>
        </div>
      </div>

      {/* Banner */}

      <div className="hero-section">
        <div className="banner-slider">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`banner-slide ${
                index === currentBanner ? "active" : ""
              }`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="banner-bg"
              />

              <div className="banner-overlay"></div>

              <div className="banner-content">
                <h2>{banner.title}</h2>
                <p>{banner.subtitle}</p>

                <Link to={ROUTES.STUDENT_JOBS} className="banner-btn">
                  Khám phá ngay
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs */}

      <div className="content-sections">
        <section className="job-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">🔥 Việc làm mới nhất</h2>
              <p className="section-desc">
                Các công việc được đăng gần đây từ nhà tuyển dụng
              </p>
            </div>

            <Link to={ROUTES.STUDENT_JOBS} className="see-all-btn">
              Xem tất cả
            </Link>
          </div>

          <div className="job-cards-grid">
            {currentJobs.length === 0 ? (
              <p style={{ color: "#94a3b8" }}>
                Hiện chưa có việc làm nào được đăng.
              </p>
            ) : (
              currentJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Trang trước
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    className={`pagination-number ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Trang sau
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentDashboardPage;