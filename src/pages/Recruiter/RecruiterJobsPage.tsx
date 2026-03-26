import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import RecruiterJobList from '../../components/recruiter/RecruiterJobList'
import { getMyRecruiterJobs, deleteMultipleJobs } from '../../features/jobs/jobsService'
import type { JobItem } from '../../types/domain'
import { PageHeader } from '../../components/common/PageHeader'
import './RecruiterJobsPage.css'
import '../PageUI.css'

const RecruiterJobsPage = () => {
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'draft' | 'closed'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])

  const fetchJobs = () => {
    setLoading(true)
    setError(null)
    getMyRecruiterJobs()
      .then((response) => setJobs(response ?? []))
      .catch((err: unknown) => {
        console.error('Error fetching jobs:', err)
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách tin tuyển dụng.')
        setJobs([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleDeleteSelected = async () => {
    if (selectedJobs.length === 0) return

    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa ${selectedJobs.length} tin đã chọn?`)
    if (confirmDelete) {
      try {
        await deleteMultipleJobs(selectedJobs)
        setSelectedJobs([])
        setEditMode(false)
        fetchJobs()
      } catch (err) {
        alert('Có lỗi xảy ra khi xóa tin tuyển dụng.')
      }
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const text = `${job.title} ${job.company} ${job.location || ''}`.toLowerCase()
    const passKeyword = keyword.trim() ? text.includes(keyword.trim().toLowerCase()) : true
    const passStatus = statusFilter === 'all' ? true : job.status === statusFilter
    return passKeyword && passStatus
  })

  const bannedCount = jobs.filter((job) => job.moderationStatus === 'rejected').length

  return (
    <div className="page-ui">
      <div className="page-ui__container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <button
            className="page-ui__btn page-ui__btn--success"
            onClick={() => {
              setEditMode(!editMode)
              setSelectedJobs([]) 
            }}
          >
            {editMode ? 'Hủy' : 'Edit'}
          </button>
          <PageHeader
            title="Quản lý tin tuyển dụng"
            subtitle={`${jobs.length} tin · ${bannedCount} tin đã bị ban.`}
          />
          <Link to={ROUTES.RECRUITER_JOB_CREATE} className="page-ui__btn page-ui__btn--success" style={{ textDecoration: 'none' }}>
            Đăng tin mới
          </Link>
        </div>

        {error && <p className="page-ui__error">{error}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '14px' }}>
          <input
            className="page-ui__input"
            placeholder="Tìm theo tiêu đề, công ty, địa điểm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select
            className="page-ui__input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="open">Đang mở</option>
            <option value="draft">Nháp</option>
            <option value="closed">Đã đóng</option>
          </select>
        </div>

        <RecruiterJobList
          jobs={filteredJobs}
          loading={loading}
          editMode={editMode}
          selectedJobs={selectedJobs}
          setSelectedJobs={setSelectedJobs}
        />

        {/* STRICT LOGIC: Only renders if Edit Mode is ON 
            AND at least one job is selected 
        */}
        {editMode && selectedJobs.length > 0 && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#111827',
            border: '1px solid #ef4444', // Red border to indicate danger/delete
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            animation: 'fadeIn 0.2s ease-in-out'
          }}>
            <span style={{ color: '#fca5a5' }}>
              Bạn đã chọn <strong>{selectedJobs.length}</strong> tin để xóa
            </span>

            <button 
              onClick={handleDeleteSelected}
              className="page-ui__btn"
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px 20px'
              }}
            >
              Xác nhận xóa các mục đã chọn
            </button>
          </div>
        )}

        <p style={{ marginTop: '16px' }}>
          <Link to={ROUTES.RECRUITER_DASHBOARD} className="page-ui__back-link">← Về trang tổng quan</Link>
        </p>
      </div>
    </div>
  )
}

export default RecruiterJobsPage