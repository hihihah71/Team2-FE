import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { JobCard } from '../../components/job/JobCard'
import { Pagination } from '../../components/common/Pagination'
import { PageHeader } from '../../components/common/PageHeader'
import { TagFilter } from '../../components/common/TagFilter'
import { useJobs } from '../../features/jobs/useJobs'
import '../PageUI.css'

const StudentJobsPage = () => {
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [salaryFilter, setSalaryFilter] = useState<'all' | 'under15' | '15to30' | 'over30'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'salary'>('newest')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 12 // Increased pageSize for backend pagination
  
  // Salary mapping for backend
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

  const { jobs, loading, error, total } = useJobs({ 
    search: debouncedSearch, 
    page, 
    limit: pageSize, 
    tags: selectedTags,
    location: locationFilter,
    salaryMin: salaryMinMap[salaryFilter]
  })

  const filteredJobs = useMemo(() => {
    // Backend now does most filtering, we just sort here if needed
    let items = [...jobs]
    items.sort((a, b) => {
      if (sortBy === 'salary') return (b.salaryMin || 0) - (a.salaryMin || 0)
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    })
    return items
  }, [jobs, sortBy])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const onChangeSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="page-ui">
      <div className="page-ui__container">
        <PageHeader
          title="Tìm việc"
          subtitle="Bộ lọc nâng cao theo vị trí, mức lương, sắp xếp theo độ mới và lương."
        />

        <section className="page-ui__card">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <input
              className="page-ui__input"
              placeholder="Tìm theo tiêu đề hoặc công ty"
              value={search}
              onChange={(e) => onChangeSearch(e.target.value)}
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

          <p className="page-ui__muted" style={{ marginTop: '16px' }}>
            Tìm thấy {total} công việc phù hợp
          </p>

          {error && <p className="page-ui__error">{error}</p>}
          {loading ? (
            <p className="page-ui__muted">Đang tải danh sách việc làm...</p>
          ) : filteredJobs.length === 0 ? (
            <p className="page-ui__muted">Không có công việc phù hợp với bộ lọc hiện tại.</p>
          ) : (
            <div className="page-ui__grid page-ui__grid--two-cols">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  detailPath={ROUTES.STUDENT_JOB_DETAIL.replace(':jobId', job._id)}
                />
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </section>

        <p style={{ marginTop: '16px' }}>
          <Link to={ROUTES.STUDENT_MY_JOBS} style={{ color: '#60a5fa' }}>
            Xem đơn đã apply & đã lưu →
          </Link>
        </p>
      </div>
    </div>
  )
}

export default StudentJobsPage
