import { useMemo, useState, useEffect } from 'react'
import { ROUTES } from '../../constants/routes'
import { JobCard } from '../../components/job/JobCard'
import { Pagination } from '../../components/common/Pagination'
import { PageHeader } from '../../components/common/PageHeader'
import { TagFilter } from '../../components/common/TagFilter'
import { useJobs } from '../../features/jobs/useJobs'
import '../PageUI.css'

// Import thư viện biểu đồ
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const RecruiterBrowseJobsPage = () => {
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [salaryFilter, setSalaryFilter] = useState<'all' | 'under15' | '15to30' | 'over30'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'salary'>('newest')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 12

  // Dữ liệu giả lập cho Insights
  const marketInsights = {
    salaryData: {
      labels: ['IT/Phần mềm', 'Marketing', 'Thiết kế', 'Sale', 'Nhân sự'],
      datasets: [{
        label: 'Lương trung bình thị trường (Triệu VNĐ)',
        data: [22, 15, 14, 12, 11],
        backgroundColor: '#8A9A5B', // Sage Green
        borderRadius: 6,
      }]
    },
    skillData: {
      labels: ['React/TS', 'Node.js', 'UI/UX', 'Python', 'Khác'],
      datasets: [{
        data: [40, 25, 15, 10, 10],
        backgroundColor: ['#1ce49777', '#dfe382', '#f6ca07', '#00fec3', '#d95656'],
        borderWidth: 0,
      }]
    }
  }

  const salaryMinMap = {
    all: undefined,
    under15: 0,
    '15to30': 15000000,
    over30: 30000001,
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const { jobs, loading, total } = useJobs({ 
    search: debouncedSearch, 
    page, 
    limit: pageSize, 
    tags: selectedTags,
    location: locationFilter,
    salaryMin: salaryMinMap[salaryFilter]
  })

  const filteredJobs = useMemo(() => {
    let items = [...jobs]
    items.sort((a, b) => {
      if (sortBy === 'salary') return (b.salaryMin || 0) - (a.salaryMin || 0)
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    })
    return items
  }, [jobs, sortBy])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="page-ui">
      <div className="page-ui__container">
        <PageHeader
          title="Phân tích Thị trường & Đối thủ"
          subtitle="Công cụ hỗ trợ nhà tuyển dụng theo dõi mức lương cạnh tranh và nguồn cung nhân lực trên hệ thống."
        />

        {/* MARKET INSIGHTS DASHBOARD */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '20px', 
          marginBottom: '24px' 
        }}>
          {/* Biểu đồ 1: Lương đối thủ */}
          <div className="page-ui__card" style={{ padding: '20px' }}>
            <h4 style={{ marginBottom: '16px', color: '#ffffff' }}></h4>
            <div style={{ height: '400px', width: '100%' }}>
              <Bar 
                data={marketInsights.salaryData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { display: false },
                    title: {
                      display: true,
                      text: 'Lương trung bình theo ngành',
                      font: { size: 22 },
                      color: '#ffffff',
                    },
                    tooltip: {
                      bodyFont: { size: 18, family: "'Times New Roman', serif" },
                      titleFont: { size: 18, family: "'Times New Roman', serif" },
                    },
                  },
                  scales: {
                    x: { ticks: { font: { size: 16, family: "'Times New Roman', serif" }, color: '#ffffff' } },
                    y: { ticks: { font: { size: 16, family: "'Times New Roman', serif" }, color: '#ffffff' } },
                  },
                }} 
              />
            </div>
          </div>

          {/* Biểu đồ 2: Phân bổ kỹ năng */}
          <div className="page-ui__card" style={{ padding: '20px' }}>
            <h4 style={{ marginBottom: '16px', color: '#ffffff',textAlign: 'center'  }}>Nguồn cung kỹ năng (Ứng viên)</h4>
            <div style={{ height: '400px', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Pie 
                data={marketInsights.skillData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: { font: { size: 16, family: "'Times New Roman', serif" }, color: '#ffffff' },
                    },
                    tooltip: {
                      bodyFont: { size: 18, family: "'Times New Roman', serif" },
                      titleFont: { size: 18, family: "'Times New Roman', serif" },
                    },
                  },
                }} 
              />
            </div>
          </div>
        </div>

        {/* FILTERS AND JOB LIST */}
        <section className="page-ui__card">
          <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <input
              className="page-ui__input"
              placeholder="Tìm tin tuyển dụng của đối thủ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              className="page-ui__input"
              placeholder="Lọc theo địa điểm"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <select
              className="page-ui__input"
              value={salaryFilter}
              onChange={(e) => setSalaryFilter(e.target.value as typeof salaryFilter)}
            >
              <option value="all">Mức lương bất kỳ</option>
              <option value="under15">Dưới 15 triệu</option>
              <option value="15to30">15 - 30 triệu</option>
              <option value="over30">Trên 30 triệu</option>
            </select>
            <select
              className="page-ui__input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="newest">Mới nhất</option>
              <option value="salary">Lương cao trước</option>
            </select>
          </div>

          <TagFilter
            selected={selectedTags}
            onChange={(tags) => { setSelectedTags(tags); setPage(1) }}
          />

          <p className="page-ui__muted" style={{ marginTop: '16px', color: '#ffffff' }}>
            Đang hiển thị {total} tin tuyển dụng trên toàn thị trường
          </p>

          {loading ? (
            <p className="page-ui__muted" style={{ color: '#ffffff' }}>Đang phân tích dữ liệu...</p>
          ) : (
            <div className="page-ui__grid page-ui__grid--two-cols">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  detailPath={ROUTES.RECRUITER_BROWSE_JOB_DETAIL.replace(':jobId', job._id)}
                  actionLabel="Phân tích tin này"
                />
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </section>
      </div>
    </div>
  )
}

export default RecruiterBrowseJobsPage;