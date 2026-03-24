import React, { useRef, useState } from 'react'
import { useCVStore, type CVTemplateType } from '../store/cvStore'
import {
  Download, Image as ImageIcon, Palette, Type, LayoutTemplate, ListOrdered,
  Copy, FileImage, Monitor, FileText, Share2, ToggleLeft, ToggleRight,
  Plus, AlignJustify, Trash2, Save, ChevronDown,
  Sparkles, PlusCircle, Edit2
} from 'lucide-react'
import { SortableSectionList } from './SortableSectionList'
import { AddSectionModal } from './AddSectionModal'

interface ToolbarProps {
  onExport: () => void
  onExportPng: () => void
  onCloneVersion: () => void
  onManualSave: () => void
  onSwitchCv: (cv: any) => void
  onCreateNew: () => void
  isExporting: boolean
  hasCvId: boolean
  isSaving: boolean
  myCvs: any[]
}

const FONT_OPTIONS = [
  { label: 'Be Vietnam Pro (Khuyên dùng)', value: '"Be Vietnam Pro", sans-serif' },
  { label: 'Inter (Hiện đại)', value: '"Inter", sans-serif' },
  { label: 'Roboto', value: '"Roboto", sans-serif' },
  { label: 'Merriweather (Học thuật)', value: '"Merriweather", serif' },
  { label: 'Lora (Cổ điển)', value: '"Lora", serif' },
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
  { label: 'Source Code Pro', value: '"Source Code Pro", monospace' },
]

export const Toolbar: React.FC<ToolbarProps> = ({ 
  onExport, onExportPng, onCloneVersion, onManualSave, onSwitchCv, onCreateNew,
  isExporting, hasCvId 
}) => {
  const {
    templateId, setTemplate,
    themeColor, setThemeColor,
    fontFamily, setFontFamily,
    spacing, setSpacing,
    setAvatarUrl,
    appMode, setAppMode,
    isPublic, setIsPublic,
    slug, setSlug,
    isSaving, myCvs, cvId, cvName, setCvName
  } = useCVStore()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showAddSection, setShowAddSection] = useState(false)
  const [showCvSelector, setShowCvSelector] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (.png, .jpg)')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) setAvatarUrl(ev.target.result as string)
    }
    reader.readAsDataURL(file)
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, color: '#64748b',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px'
  }

  const sectionStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', gap: '8px'
  }

  return (
    <>
      {showAddSection && <AddSectionModal onClose={() => setShowAddSection(false)} />}

      <div style={{
        display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a', color: 'white', 
        width: '100%', height: '100%', borderRight: '1px solid #1e293b', boxSizing: 'border-box'
      }}>
        
        {/* FIXED HEADER */}
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Sparkles size={20} color="#818cf8" /> CV Builder
             </h2>
             <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  onClick={onCreateNew}
                  title="Tạo CV mới"
                  style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', padding: '4px' }}
                >
                  <PlusCircle size={20} />
                </button>
                <button 
                  onClick={() => useCVStore.getState().setAiDrawer({ isOpen: true })}
                  className="ai-spotlight"
                  title="Mở trợ lý AI"
                  style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', padding: '4px' }}
                >
                  <Sparkles size={20} fill="#fbbf24" />
                </button>
             </div>
          </div>
          
          <div style={{ position: 'relative' }}>
              {isEditingName ? (
                <input 
                  autoFocus
                  value={cvName}
                  onChange={(e) => setCvName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  style={{
                    width: '100%', backgroundColor: '#0f172a', border: '1px solid #6366f1',
                    borderRadius: '4px', padding: '8px 12px', color: '#fff', fontSize: '13px',
                    outline: 'none', boxSizing: 'border-box'
                  }}
                />
              ) : (
                <button 
                  onClick={() => setShowCvSelector(!showCvSelector)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px',
                    padding: '10px 12px', color: '#cbd5e1', cursor: 'pointer', fontSize: '13px', textAlign: 'left'
                  }}
                >
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📁 {cvName}
                    <Edit2 size={12} color="#64748b" onClick={(e) => { e.stopPropagation(); setIsEditingName(true); }} />
                  </span>
                  <ChevronDown size={14} style={{ transform: showCvSelector ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
              )}
             {showCvSelector && (
               <div style={{
                 position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                 backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px',
                 boxShadow: '0 10px 25px rgba(0,0,0,0.4)', zIndex: 100, maxHeight: '200px', overflowY: 'auto'
               }}>
                 {myCvs.filter(c => c.cvData).map(c => (
                   <div key={c._id} onClick={() => { onSwitchCv(c); setShowCvSelector(false); }} style={{ padding: '10px 12px', fontSize: '12px', color: cvId === c._id ? '#818cf8' : '#94a3b8', borderBottom: '1px solid #0f172a', cursor: 'pointer', backgroundColor: cvId === c._id ? 'rgba(129,140,248,0.1)' : 'transparent', fontWeight: cvId === c._id ? 700 : 400 }}>
                     {c.name}
                   </div>
                 ))}
               </div>
             )}
          </div>

          <button
            onClick={onManualSave}
            disabled={isSaving}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              backgroundColor: isSaving ? '#1e293b' : '#10b981', color: 'white', border: 'none', padding: '10px',
              borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
            }}
          >
            {isSaving ? <div className="cv-spinner" /> : <Save size={16} />}
            {isSaving ? 'Đang lưu...' : 'Lưu vào hệ thống'}
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Mode Switcher */}
          <div style={{ display: 'flex', backgroundColor: '#1e293b', padding: '3px', borderRadius: '10px' }}>
            {([['pdf', <FileText size={14} key="pdf-icon" />, 'PDF'] , ['web', <Monitor size={14} key="web-icon" />, 'Web']] as const).map(([mode, icon, label]) => (
              <button key={mode} onClick={() => setAppMode(mode)} style={{ flex: 1, padding: '7px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', backgroundColor: appMode === mode ? '#6366f1' : 'transparent', color: appMode === mode ? '#fff' : '#94a3b8', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Template */}
          <div style={sectionStyle}>
            <p style={labelStyle}><LayoutTemplate size={11} style={{ display: 'inline', marginRight: 4 }} />Mẫu thiết kế</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              {(['modern', 'minimal', 'creative'] as CVTemplateType[]).map((t) => (
                <button key={t} onClick={() => setTemplate(t)} style={{ height: '42px', fontSize: '11px', textAlign: 'center', borderRadius: '8px', border: templateId === t ? '2px solid #6366f1' : '1px solid #334155', backgroundColor: templateId === t ? 'rgba(99,102,241,0.2)' : '#1e293b', color: templateId === t ? '#c7d2fe' : '#94a3b8', cursor: 'pointer', textTransform: 'capitalize', fontWeight: templateId === t ? 700 : 400 }}>
                  {t === 'modern' ? '🏢 Modern' : t === 'minimal' ? '📄 Minimal' : '🎨 Creative'}
                </button>
              ))}
            </div>
          </div>

          {/* Color & Font */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={sectionStyle}>
              <p style={labelStyle}><Palette size={11} style={{ display: 'inline', marginRight: 4 }} />Màu</p>
              <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} style={{ width: '100%', height: '36px', border: '1px solid #334155', background: '#1e293b', cursor: 'pointer', borderRadius: '8px', padding: '2px' }} />
            </div>
            <div style={sectionStyle}>
              <p style={labelStyle}><AlignJustify size={11} style={{ display: 'inline', marginRight: 4 }} />Giãn cách</p>
              <select value={spacing} onChange={(e) => setSpacing(e.target.value as any)} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', padding: '8px', borderRadius: '8px', fontSize: '12px' }}>
                <option value="compact">Gọn</option>
                <option value="normal">Vừa</option>
                <option value="spacious">Rộng</option>
              </select>
            </div>
          </div>

          <div style={sectionStyle}>
            <p style={labelStyle}><Type size={11} style={{ display: 'inline', marginRight: 4 }} />Font chữ</p>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f1f5f9', padding: '9px 10px', borderRadius: '8px', fontSize: '13px', outline: 'none' }}>
              {FONT_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>

          <div style={sectionStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ ...labelStyle, margin: 0 }}><ListOrdered size={11} style={{ display: 'inline', marginRight: 4 }} />Thứ tự mục</p>
              <button onClick={() => setShowAddSection(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(99,102,241,0.2)', border: '1px solid #6366f1', color: '#c7d2fe', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>
                <Plus size={12} /> Thêm
              </button>
            </div>
            <SortableSectionList />
          </div>

          <div style={sectionStyle}>
            <p style={labelStyle}><ImageIcon size={11} style={{ display: 'inline', marginRight: 4 }} />Ảnh đại diện</p>
            <div style={{ display: 'flex', gap: '8px' }}>
               <button onClick={() => fileInputRef.current?.click()} style={{ flex: 1, padding: '8px', backgroundColor: '#1e293b', border: '1px dashed #475569', color: '#cbd5e1', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Tải lên</button>
               <button onClick={() => setAvatarUrl(null)} style={{ padding: '8px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={14} /></button>
            </div>
            <input ref={fileInputRef} type="file" style={{ display: 'none' }} accept="image/*" onChange={handleAvatarUpload} />
          </div>

          {appMode === 'web' && hasCvId && (
            <div style={{ padding: '12px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isPublic ? '8px' : 0 }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Share2 size={14} color="#38bdf8" /> Công khai (Web)
                </label>
                <button onClick={() => setIsPublic(!isPublic)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {isPublic ? <ToggleRight size={24} color="#10b981" /> : <ToggleLeft size={24} color="#64748b" />}
                </button>
              </div>
              {isPublic && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ backgroundColor: '#0f172a', padding: '6px 8px', fontSize: '11px', color: '#64748b', borderRadius: '6px 0 0 6px', border: '1px solid #334155' }}>/cv/</span>
                  <input type="text" value={slug || ''} onChange={(e) => setSlug(e.target.value)} placeholder="slug..." style={{ flex: 1, padding: '6px 8px', fontSize: '12px', backgroundColor: '#fff', color: '#0f172a', border: '1px solid #334155', borderRadius: '0 6px 6px 0', width: '0' }} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* FIXED FOOTER */}
        <div style={{ padding: '12px 16px 20px', borderTop: '1px solid #1e293b', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button onClick={onCloneVersion} disabled={isExporting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#334155', color: '#cbd5e1', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, fontSize: '12px', cursor: isExporting ? 'not-allowed' : 'pointer' }}>
              <Copy size={14} /> Nhân bản
            </button>
            <button onClick={onExportPng} disabled={isExporting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, fontSize: '12px', cursor: isExporting ? 'not-allowed' : 'pointer' }}>
              <FileImage size={14} /> PNG
            </button>
          </div>
          <button onClick={onExport} disabled={isExporting} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 800, fontSize: '14px', cursor: isExporting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
            <Download size={18} /> Xuất PDF (A4)
          </button>
        </div>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes spotlight-pulse {
            0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(251, 191, 36, 0.7)); }
            50% { transform: scale(1.15); filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.9)); }
            100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(251, 191, 36, 0)); }
          }
          .cv-spinner {
            width: 14px; height: 14px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;
          }
          .ai-spotlight {
            animation: spotlight-pulse 2s infinite ease-in-out;
          }
        `}</style>
      </div>
    </>
  )
}
