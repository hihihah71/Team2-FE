// Màn hình quản lý CV (upload, danh sách CV, chọn CV chính)
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import StudentCVList from '../../components/student/StudentCVList'
import { deleteCv, getMyCVs, updateCv, uploadPdfCv } from '../../features/cvs/cvsService'
import type { CvItem } from '../../types/domain'
import { PageHeader } from '../../components/common/PageHeader'
import { getMyProfile } from '../../features/profile/profileService'
import { buildProfilePdfFile } from '../../features/cvs/profilePdf'
import './StudentCVPage.css'
import '../PageUI.css'

const StudentCVPage = () => {
  const [cvs, setCvs] = useState<CvItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newCvName, setNewCvName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFilePreviewUrl, setSelectedFilePreviewUrl] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getMyCVs()
      .then((data) => {
        if (cancelled) return
        setCvs(data ?? [])
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Không thể tải danh sách CV.'
        setError(message)
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selectedFile) {
      setSelectedFilePreviewUrl('')
      return
    }
    const url = URL.createObjectURL(selectedFile)
    setSelectedFilePreviewUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [selectedFile])

  const handleGenerateProfileCv = async () => {
    try {
      setCreating(true)
      const profile = await getMyProfile()
      const pdfFile = buildProfilePdfFile(profile, 'CV_Profile_Auto.pdf')
      setSelectedFile(pdfFile)
      setNewCvName('CV tự động từ Profile')
      setError(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể tạo CV từ profile.'
      setError(message)
    } finally {
      setCreating(false)
    }
  }

  const handleCreateCv = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn file PDF trước khi upload.')
      return
    }
    if (selectedFile.type !== 'application/pdf') {
      setError('Chỉ hỗ trợ upload file PDF.')
      return
    }
    try {
      setCreating(true)
      const created = await uploadPdfCv(selectedFile, {
        name: newCvName.trim() || selectedFile.name,
        isDefault: cvs.length === 0,
      })
      setCvs((prev) => (created ? [created, ...prev] : prev))
      setNewCvName('')
      setSelectedFile(null)
      setError(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể tạo CV mới.'
      setError(message)
    } finally {
      setCreating(false)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const updated = await updateCv(id, { isDefault: true })
      setCvs((prev) =>
        prev.map((cv) =>
          cv._id === updated._id ? updated : { ...cv, isDefault: false },
        ),
      )
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể đặt CV mặc định.'
      setError(message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa CV này?')) return
    try {
      await deleteCv(id)
      setCvs((prev) => prev.filter((cv) => cv._id !== id))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể xóa CV.'
      setError(message)
    }
  }

  return (
    <div className="page-ui">
      <div className="page-ui__container">
        <PageHeader
          title="Quản lý CV"
          subtitle="Upload PDF hoặc tạo CV tự động từ Profile, có preview trước khi lưu."
        />

        {error && (
          <p className="page-ui__error">{error}</p>
        )}

        <section className="student-cv-card page-ui__card">
          <div className="student-cv-form-row">
          <input
            type="text"
            placeholder="Tên hiển thị CV (tuỳ chọn)"
            value={newCvName}
            onChange={(e) => setNewCvName(e.target.value)}
            className="student-cv-input"
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="student-cv-input"
          />
          <button
            type="button"
            onClick={handleCreateCv}
            disabled={creating}
            className="student-cv-add-btn"
          >
            {creating ? 'Đang tạo...' : 'Thêm CV'}
          </button>
          <button
            type="button"
            onClick={handleGenerateProfileCv}
            disabled={creating}
            className="page-ui__btn page-ui__btn--primary"
          >
            Tạo CV từ Profile
          </button>
          </div>
          {selectedFile && (
            <p className="page-ui__muted" style={{ marginTop: '8px' }}>
              File đã chọn: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </p>
          )}
          {selectedFilePreviewUrl && (
            <div style={{ marginTop: '12px' }}>
              <p className="page-ui__muted" style={{ marginBottom: '6px' }}>
                Preview PDF trước khi lưu:
              </p>
              <iframe
                src={selectedFilePreviewUrl}
                title="CV preview before upload"
                style={{
                  width: '100%',
                  height: '420px',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  background: '#0b1220',
                }}
              />
            </div>
          )}

          <StudentCVList
            cvs={cvs}
            loading={loading}
            onSetDefault={handleSetDefault}
            onDelete={handleDelete}
          />
        </section>
        <p style={{ marginTop: '16px' }}>
          <Link to={ROUTES.STUDENT_DASHBOARD} className="page-ui__back-link">← Về trang tổng quan</Link>
        </p>
      </div>
    </div>
  )
}

export default StudentCVPage

