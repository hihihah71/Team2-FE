import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '../../components/common/PageHeader'
import { getAdminJobDetail } from '../../features/admin/adminService'
import { ROUTES } from '../../constants/routes'

const AdminJobDetailPage = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!jobId) return
    setLoading(true)
    getAdminJobDetail(jobId).then(setJob).catch(() => setJob(null)).finally(() => setLoading(false))
  }, [jobId])

  if (loading) return <p className="page-ui__muted">Đang tải chi tiết bài đăng...</p>
  if (!job) return <p className="page-ui__error">Không tìm thấy bài đăng.</p>

  return (
    <>
      <PageHeader title="Chi tiết bài đăng" subtitle="Xem toàn bộ nội dung bài đăng tuyển dụng." />
      <section className="page-ui__card">
        <p><strong>Tiêu đề:</strong> {job.title}</p>
        <p><strong>Công ty:</strong> {job.company}</p>
        <p><strong>Địa điểm:</strong> {job.location || 'Không có'}</p>
        <p><strong>Số điện thoại:</strong> {job.phone || 'Không có'}</p>
        <p><strong>Trạng thái đăng:</strong> {job.status || 'open'}</p>
        <p><strong>Trạng thái kiểm duyệt:</strong> {job.moderationStatus || 'approved'}</p>
        <p><strong>Mô tả:</strong></p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{job.description || 'Không có mô tả'}</p>
        <p><strong>Yêu cầu:</strong></p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{job.requirements || 'Không có yêu cầu'}</p>
        <div style={{ marginTop: '12px' }}>
          <Link className="page-ui__btn page-ui__btn--secondary" style={{ textDecoration: 'none' }} to={ROUTES.ADMIN_JOBS}>
            Quay lại danh sách bài đăng
          </Link>
        </div>
      </section>
    </>
  )
}

export default AdminJobDetailPage
