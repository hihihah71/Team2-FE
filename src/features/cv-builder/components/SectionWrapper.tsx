import React from 'react'
import { Eye, EyeOff, GripVertical } from 'lucide-react'
import { useCVStore } from '../store/cvStore'

interface SectionWrapperProps {
  sectionId: string
  children: React.ReactNode
  /** Alias cho `label` — template dùng `title` */
  label?: string
  title?: string
  /** Dùng khi bọc từng dòng trong section lặp (kinh nghiệm, học vấn, …) */
  itemIndex?: number
  isDragging?: boolean
  dragHandleProps?: Record<string, any>
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  sectionId,
  children,
  label,
  title,
  isDragging,
  dragHandleProps,
}) => {
  const { hiddenSections, toggleHideSection, isReadOnly, appMode } = useCVStore()
  const isHidden = hiddenSections.includes(sectionId)
  const displayLabel = label ?? title

  // In read-only or PDF export: don't render hidden sections at all
  if (isHidden && (isReadOnly || appMode === 'pdf')) return null

  return (
    <div
      style={{
        position: 'relative',
        opacity: isHidden ? 0.38 : 1,
        transition: 'opacity 0.2s, box-shadow 0.2s',
        borderRadius: '8px',
        boxShadow: isDragging ? '0 8px 32px rgba(99,102,241,0.25)' : 'none',
      }}
      className="cv-section-wrapper"
    >
      {/* Edit-mode controls (not shown in read-only) */}
      {!isReadOnly && (
        <div
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            display: 'flex',
            gap: '4px',
            opacity: 0,
            transition: 'opacity 0.15s',
            zIndex: 20,
          }}
          className="cv-section-controls"
        >
          {/* Drag handle */}
          {dragHandleProps && (
            <span
              {...dragHandleProps}
              title="Kéo để sắp xếp"
              style={{
                cursor: 'grab',
                backgroundColor: 'rgba(30,41,59,0.8)',
                color: '#94a3b8',
                borderRadius: '5px',
                padding: '3px 5px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <GripVertical size={14} />
            </span>
          )}

          {/* Hide/Show toggle */}
          <button
            type="button"
            onClick={() => toggleHideSection(sectionId)}
            title={isHidden ? 'Hiện mục này' : 'Ẩn mục này'}
            style={{
              backgroundColor: isHidden ? 'rgba(239,68,68,0.8)' : 'rgba(30,41,59,0.8)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '3px 5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
            {isHidden ? 'Ẩn' : 'Hiện'}
          </button>
        </div>
      )}

      {/* Hidden badge (only in edit mode) */}
      {isHidden && !isReadOnly && (
        <div style={{
          textAlign: 'center',
          padding: '4px',
          fontSize: '11px',
          color: '#f87171',
          fontStyle: 'italic',
          background: 'rgba(239,68,68,0.06)',
          borderRadius: '6px',
          marginBottom: '4px'
        }}>
          🙈 Mục "{displayLabel ?? sectionId}" đang bị ẩn — sẽ không xuất hiện trong PDF/Public
        </div>
      )}

      {children}

      {/* Hover-reveal controls via global CSS */}
      <style>{`
        .cv-section-wrapper:hover .cv-section-controls {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  )
}
