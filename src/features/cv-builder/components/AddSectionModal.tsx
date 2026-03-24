import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useCVStore } from '../store/cvStore'

interface AddSectionModalProps {
  onClose: () => void
}

const PRESET_SECTIONS = [
  { id: 'custom', label: '✏️ Tạo section tùy chỉnh', placeholder: 'Tên mục...' },
  { id: 'languages', label: '🌐 Ngôn ngữ' },
  { id: 'awards', label: '🏆 Giải thưởng' },
  { id: 'volunteering', label: '🤝 Tình nguyện' },
  { id: 'publications', label: '📖 Bài báo / Nghiên cứu' },
  { id: 'references', label: '📋 Tham khảo' },
]

export const AddSectionModal: React.FC<AddSectionModalProps> = ({ onClose }) => {
  const { addCustomSection } = useCVStore()
  const [customTitle, setCustomTitle] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const handleAdd = () => {
    const title =
      selected === 'custom'
        ? customTitle.trim()
        : PRESET_SECTIONS.find((s) => s.id === selected)?.label?.replace(/^.+?\s/, '') || ''
    if (!title) return
    addCustomSection(title)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '28px',
          width: '360px',
          maxWidth: '90vw',
          color: 'white',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>➕ Thêm mục mới</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {PRESET_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: '8px',
                border: selected === s.id ? '1px solid #6366f1' : '1px solid #334155',
                backgroundColor: selected === s.id ? 'rgba(99,102,241,0.18)' : 'transparent',
                color: selected === s.id ? '#c7d2fe' : '#94a3b8',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.15s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {selected === 'custom' && (
          <input
            type="text"
            placeholder="Nhập tên mục tùy chỉnh..."
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
            autoFocus
            style={{
              width: '100%',
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              color: '#f1f5f9',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              marginBottom: '16px',
              boxSizing: 'border-box',
            }}
          />
        )}

        <button
          onClick={handleAdd}
          disabled={!selected || (selected === 'custom' && !customTitle.trim())}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: !selected ? '#1e293b' : '#6366f1',
            color: !selected ? '#475569' : 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: !selected ? 'not-allowed' : 'pointer',
            fontSize: '15px',
            fontWeight: 700,
            transition: 'background 0.2s',
          }}
        >
          Thêm mục
        </button>
      </div>
    </div>
  )
}
