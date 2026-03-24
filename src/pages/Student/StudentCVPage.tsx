import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import StudentCVList from '../../components/student/StudentCVList'
import { deleteCv, getMyCVs, updateCv, uploadPdfCv } from '../../features/cvs/cvsService'
import type { CvItem } from '../../types/domain'
import { PageHeader } from '../../components/common/PageHeader'
import { CVBuilderLayout } from '../../features/cv-builder/CVBuilderLayout'
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
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Advanced CV builder
  const [showBuilder, setShowBuilder] = useState(false)
  const [editingCv, setEditingCv] = useState<CvItem | undefined>(undefined)

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

  const handleFileSelect = (file: File | null) => {
    if (file && file.type !== 'application/pdf') {
      setError('Chỉ hỗ trợ upload file PDF.')
      return
    }
    setSelectedFile(file)
    setError(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleCreateCv = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn file PDF trước khi upload.')
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
          subtitle="Upload PDF hoặc tạo CV bằng Advanced Builder với nhiều mẫu thiết kế chuyên nghiệp."
        />

        {error && <p className="page-ui__error">{error}</p>}

        {/* Upload section */}
        <section className="cv-upload page-ui__card">
          <h3 className="cv-upload__title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Thêm CV mới
          </h3>

          <div className="cv-upload__name-row">
            <label className="cv-upload__label">Tên hiển thị (Nếu tự Tải lên)</label>
            <input
              type="text"
              placeholder="Ví dụ: CV Frontend Developer 2026"
              value={newCvName}
              onChange={(e) => setNewCvName(e.target.value)}
              className="page-ui__input"
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            hidden
          />

          <div
            className={`cv-upload__dropzone ${dragOver ? 'cv-upload__dropzone--active' : ''} ${selectedFile ? 'cv-upload__dropzone--has-file' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFile ? (
              <div className="cv-upload__file-info">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <div>
                  <p className="cv-upload__file-name">{selectedFile.name}</p>
                  <p className="cv-upload__file-size">{(selectedFile.size / 1024).toFixed(0)} KB • PDF</p>
                </div>
                <button
                  type="button"
                  className="cv-upload__file-clear"
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}
                  title="Bỏ chọn file"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <svg className="cv-upload__dropzone-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <p className="cv-upload__dropzone-text">
                  Kéo thả file PDF vào đây hoặc <span>nhấn để chọn file</span>
                </p>
                <p className="cv-upload__dropzone-hint">Chỉ hỗ trợ file PDF tự upload, tối đa 10MB</p>
              </>
            )}
          </div>

          {selectedFilePreviewUrl && (
            <div className="cv-upload__preview">
              <p className="cv-upload__preview-label">Xem trước PDF:</p>
              <iframe
                src={selectedFilePreviewUrl}
                title="CV preview"
                className="cv-upload__preview-frame"
              />
            </div>
          )}

          <div className="cv-upload__actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleCreateCv}
              disabled={creating || !selectedFile}
              className="page-ui__btn page-ui__btn--primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {creating ? 'Đang upload...' : 'Lưu File Upload'}
            </button>
            
            <div style={{ height: '30px', width: '1px', backgroundColor: '#e2e8f0' }}></div>
            
            <button
              type="button"
              onClick={() => {
                setEditingCv(undefined)
                setShowBuilder(true)
              }}
              className="page-ui__btn"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                color: 'white', border: 'none', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.25)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Tạo CV (Bản Đẹp Nâng Cao)
            </button>
          </div>
        </section>

        {/* CV List section */}
        <section className="cv-list-section">
          <h3 className="cv-list-section__title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            CV của bạn ({cvs.length})
          </h3>
          <StudentCVList
            cvs={cvs}
            loading={loading}
            onSetDefault={handleSetDefault}
            onDelete={handleDelete}
            onEdit={(cv) => {
              setEditingCv(cv)
              setShowBuilder(true)
            }}
          />
        </section>

        <p style={{ marginTop: '16px' }}>
          <Link to={ROUTES.STUDENT_DASHBOARD} className="page-ui__back-link">← Về trang tổng quan</Link>
        </p>

        {/* The Advanced CV Builder Overlay */}
        {showBuilder && (
          <CVBuilderLayout 
            initialCv={editingCv}
            onClose={() => {
              setShowBuilder(false)
              setEditingCv(undefined)
            }}
            onSaved={(newCv) => {
              if (newCv) {
                // Determine if it was an update or create
                setCvs(prev => {
                  const exists = prev.find(c => c._id === newCv._id)
                  if (exists) {
                    return prev.map(c => c._id === newCv._id ? newCv : c)
                  }
                  return [newCv, ...prev]
                })
              }
            }}
            cvsCount={cvs.length}
          />
        )}
      </div>
    </div>
  )
}

export default StudentCVPage
