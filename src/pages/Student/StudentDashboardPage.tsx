import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { CheckCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getJobs } from '../../features/jobs/jobsService'
import type { JobItem } from '../../types/domain'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { JobCard } from '../../components/job/JobCard'
import { Pagination } from '../../components/common/Pagination'
import { PageHeader } from '../../components/common/PageHeader'

// 1. IMPORT CHART.JS COMPONENTS
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Chart } from 'react-chartjs-2';

import './StudentDashboardPage.css'
import '../PageUI.css'

// 2. REGISTER CHART.JS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const StudentDashboardPage = () => {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const jobsPerPage = 12

  const banners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      title: "Tuyển dụng Part-time & Thực tập sinh",
      subtitle: "Hàng ngàn cơ hội việc làm hấp dẫn dành cho sinh viên",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
      title: "Chương trình Job Fair 2026",
      subtitle: "Kết nối trực tiếp với nhà tuyển dụng",
    },
  ]

  /* ---------------- 3. MOCK DATA FOR CHARTS ---------------- */
  
  // 1. Skill Chart - Grouped Bar (Current vs Required)
  const skillGapBarData = {
    labels: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    datasets: [
      {
        label: 'Kỹ năng hiện có',
        data: [95, 80, 85, 70, 60],
        backgroundColor: '#8A9A5B', // Sage Green
        borderRadius: 4,
      },
      {
        label: 'Yêu cầu thị trường',
        data: [90, 85, 95, 90, 80],
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue
        borderRadius: 4,
      },
    ],
  };

  // 2. Trend Chart - Mixed (Line + Bar)
  const marketTrendData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        type: 'line' as const,
        label: 'Số lượng ứng viên nộp đơn',
        borderColor: '#3b82f6',
        borderWidth: 2,
        data: [15, 25, 20, 30, 22, 35],
        fill: false,
        tension: 0.3,
        pointBackgroundColor: '#3b82f6',
      },
      {
        type: 'bar' as const,
        label: 'Tin tuyển dụng mới',
        backgroundColor: 'rgba(138, 154, 91, 0.4)',
        data: [5, 8, 6, 10, 7, 12],
        borderRadius: 4,
      },
    ],
  };

  // Chart Options for Dark/Cream UI
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#ffffff', font: { size: 12 } }
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: { color: '#ffffff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: { 
        ticks: { color: '#ffffff' },
        grid: { display: false }
      }
    }
  };

  /* ---------------- FETCH JOBS ---------------- */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs({ page: 1, limit: 60 })
        setJobs(data.items)
      } catch (error) { 
        console.error('Failed to fetch jobs:', error); 
        setJobs([]) 
      }
    }
    fetchJobs()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentBanner((prev) => (prev + 1) % banners.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const indexOfLastJob = currentPage * jobsPerPage
  const currentJobs = jobs.slice(indexOfLastJob - jobsPerPage, indexOfLastJob)
  const totalPages = Math.ceil(jobs.length / jobsPerPage)

  const curvedContainerStyle: React.CSSProperties = { position: 'relative', overflow: 'hidden' }
  const blueStripe = (
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
      backgroundColor: '#3b82f6', borderRadius: '4px 0 0 4px', zIndex: 1
    }} />
  )

  return (
    <div className="page-ui">
      <div className="page-ui__container">
        <div className="student-discovery-container">
          <div className="top-section">
            <PageHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Chào buổi sáng, {user?.fullName || 'Sinh Viên'}!
                  {user?.isVerified && (
                    <span title="Tài khoản đã xác thực">
                      <CheckCircle size={24} color="#3b82f6" fill="rgba(59,130,246,0.1)" />
                    </span>
                  )}
                </div>
              }
              subtitle="Cùng xem hôm nay bạn đang ở đâu trên con đường sự nghiệp nhé."
            />
          </div>

          {/* Banner */}
          <div className="hero-section page-ui__card" style={{ padding: '0', marginBottom: '24px' }}>
            <div className="banner-slider">
              {banners.map((banner, index) => (
                <div key={banner.id} className={`banner-slide ${index === currentBanner ? 'active' : ''}`}>
                  <img src={banner.image} alt={banner.title} className="banner-bg" />
                  <div className="banner-overlay"></div>
                  <div className="banner-content">
                    <h2>{banner.title}</h2>
                    <p>{banner.subtitle}</p>
                    <Link to={ROUTES.STUDENT_JOBS} className="banner-btn">Khám phá ngay</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="student-stats-grid page-ui__kpi-grid">
            <StatsCard label="Đơn đã ứng tuyển" value="12" accent="blue" />
            <StatsCard label="Đã shortlist" value="3" accent="green" />
            <StatsCard label="Lịch phỏng vấn" value="1" accent="purple" />
            <StatsCard label="Tin đã lưu" value="8" accent="purple" />
            <StatsCard label="CV đang dùng" value="Primary_CV.pdf" accent="blue" />
          </div>

          {/* 4. CHARTS SECTION */}
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '20px', marginTop: '20px' 
          }}>
            {/* Skill Comparison Chart */}
            <section className="page-ui__card" style={curvedContainerStyle}>
              {blueStripe}
              <div style={{ padding: '20px' }}>
                <h4 style={{ marginBottom: '16px', color: '#ffffff', textAlign: 'center' }}>So sánh kỹ năng cá nhân & Yêu cầu</h4>
                <div style={{ height: '300px' }}>
                  <Bar data={skillGapBarData} options={chartOptions} />
                </div>
              </div>
            </section>

            {/* Market Trend Chart */}
            <section className="page-ui__card" style={curvedContainerStyle}>
              {blueStripe}
              <div style={{ padding: '20px' }}>
                <h4 style={{ marginBottom: '16px', color: '#ffffff', textAlign: 'center' }}>Xu hướng & Cạnh tranh ngành</h4>
                <div style={{ height: '300px' }}>
                  <Chart type='bar' data={marketTrendData} options={chartOptions} />
                </div>
              </div>
            </section>
          </div>

          {/* Jobs Section */}
          <div className="content-sections">
            <section className="job-section page-ui__card" style={curvedContainerStyle}>
              {blueStripe}
              <div style={{ paddingLeft: '12px' }}>
                <div className="section-header">
                  <h2 className="section-title">Việc làm mới nhất</h2>
                  <Link to={ROUTES.STUDENT_JOBS} className="see-all-btn">Xem tất cả</Link>
                </div>
                <div className="job-cards-grid">
                  {currentJobs.map((job) => (
                    <JobCard key={job._id} job={job} detailPath={ROUTES.STUDENT_JOB_DETAIL.replace(':jobId', job._id)} />
                  ))}
                </div>
                <div style={{ padding: '20px 0' }}>
                  <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboardPage