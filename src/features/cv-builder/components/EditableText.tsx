import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useCVStore } from '../store/cvStore'
import { Sparkles, Bold, Italic, Underline, List } from 'lucide-react'

interface EditableTextProps {
  value: string
  onChange: (val: string) => void
  multiline?: boolean
  richText?: boolean
  className?: string
  placeholder?: string
  style?: React.CSSProperties
  path?: string // Identify the field for AI Assistant
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  multiline = false,
  richText = false,
  className = '',
  placeholder = 'Nhấp để sửa...',
  style,
  path,
}) => {
  const { isReadOnly, setAiDrawer } = useCVStore()
  const [isEditing, setIsEditing] = useState(false)
  const [localVal, setLocalVal] = useState(value || '')
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const richRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setLocalVal(value || '') }, [value])

  useEffect(() => {
    if (isEditing && !richText && inputRef.current) {
      inputRef.current.focus()
    }
    if (isEditing && richText && richRef.current) {
      richRef.current.focus()
    }
  }, [isEditing, richText])

  const commit = useCallback(() => {
    setIsEditing(false)
    const newVal = richText ? (richRef.current?.innerHTML || '') : localVal
    if (newVal !== value) onChange(newVal)
  }, [localVal, value, onChange, richText])

  const handleOpenAiAssistant = (e: React.MouseEvent) => {
    e.stopPropagation()
    const raw = richText
      ? (richRef.current?.innerText || '')
      : (isEditing ? localVal : value);
      
    setAiDrawer({
      isOpen: true,
      currentText: raw,
      currentPath: path || null
    })
  }

  const execFormat = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value)
    richRef.current?.focus()
  }

  // ── Read-Only ─────────────────────────────────────────────────────────────
  if (isReadOnly) {
    if (multiline || richText) {
      return (
        <span
          className={className}
          style={{ ...style, display: 'block', whiteSpace: 'pre-line' }}
          dangerouslySetInnerHTML={richText ? { __html: value } : undefined}
        >
          {!richText ? value : undefined}
        </span>
      )
    }
    return <span className={className} style={{ ...style, display: 'inline-block' }}>{value}</span>
  }

  // ── Rich-Text Editing ─────────────────────────────────────────────────────
  if (isEditing && richText) {
    return (
      <div style={{ position: 'relative', width: '100%', zIndex: 11 }}>
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '6px',
          background: '#1e293b', borderRadius: '8px', padding: '4px 6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        }}>
          {[
            { icon: <Bold size={14} />, cmd: 'bold', title: 'Bold (Ctrl+B)' },
            { icon: <Italic size={14} />, cmd: 'italic', title: 'Italic (Ctrl+I)' },
            { icon: <Underline size={14} />, cmd: 'underline', title: 'Underline (Ctrl+U)' },
            { icon: <List size={14} />, cmd: 'insertUnorderedList', title: 'Bullet list' },
          ].map(({ icon, cmd, title }) => (
            <button
              key={cmd}
              type="button"
              title={title}
              onMouseDown={(e) => { e.preventDefault(); execFormat(cmd) }}
              style={{
                background: 'none', border: '1px solid #475569', color: '#e2e8f0',
                borderRadius: '5px', padding: '4px 7px', cursor: 'pointer',
                display: 'flex', alignItems: 'center'
              }}
            >
              {icon}
            </button>
          ))}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleOpenAiAssistant(e) }}
            style={{
              marginLeft: 'auto', background: '#8b5cf6', border: 'none',
              color: 'white', borderRadius: '6px', padding: '4px 10px',
              cursor: 'pointer', fontSize: '12px',
              fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            <Sparkles size={12} fill="white" /> Trợ lý AI
          </button>
        </div>
        <div
          ref={richRef}
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: value }}
          onBlur={(e) => {
            if (!e.currentTarget.parentNode?.contains(e.relatedTarget as Node)) commit()
          }}
          onKeyDown={(e) => { if (e.key === 'Escape') commit() }}
          className={className}
          style={{
            ...style,
            border: '1px dashed #8b5cf6',
            background: '#fff',
            color: '#111827',
            outline: 'none',
            width: '100%',
            minHeight: '80px',
            padding: '8px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.1)',
            boxSizing: 'border-box',
          }}
        />
      </div>
    )
  }

  // ── Plain Multiline Editing ────────────────────────────────────────────────
  if (isEditing && multiline) {
    const commonStyle: React.CSSProperties = {
      ...style,
      border: '1px dashed #8b5cf6',
      background: '#fff',
      color: '#111827',
      outline: 'none',
      width: '100%',
      font: 'inherit',
      padding: '8px',
      margin: '-5px -8px',
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.1)',
      position: 'relative',
      zIndex: 10,
      boxSizing: 'border-box',
    }
    return (
      <div style={{ position: 'relative', width: '100%', zIndex: 11 }}>
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={localVal}
          onChange={(e) => setLocalVal(e.target.value)}
          onBlur={(e) => {
            if (!e.currentTarget.parentNode?.contains(e.relatedTarget as Node)) commit()
          }}
          className={className}
          style={{ ...commonStyle, minHeight: '80px', resize: 'vertical' }}
        />
        <button
          type="button"
          onClick={handleOpenAiAssistant}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            position: 'absolute', bottom: '-40px', right: '0px',
            display: 'flex', alignItems: 'center', gap: '6px',
            backgroundColor: '#8b5cf6', color: 'white', border: 'none',
            padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
            fontSize: '12px', fontWeight: 600, boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)',
          }}
        >
          <Sparkles size={14} fill="white" /> AI Assistant
        </button>
      </div>
    )
  }

  // ── Single-line Editing ────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <div style={{ position: 'relative', width: '100%', display: 'inline-block' }}>
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={localVal}
          onChange={(e) => setLocalVal(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') commit() }}
          className={className}
          style={{
            ...style,
            border: '1px dashed #8b5cf6',
            background: '#fff',
            color: '#111827',
            outline: 'none',
            width: '100%',
            font: 'inherit',
            padding: '4px 6px',
            margin: '-5px -6px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.1)',
            position: 'relative',
            zIndex: 10,
          }}
        />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); handleOpenAiAssistant(e) }}
          style={{
            position: 'absolute', right: '-32px', top: '50%', transform: 'translateY(-50%)',
            background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '50%',
            width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 12, boxShadow: '0 2px 6px rgba(139, 92, 246, 0.4)'
          }}
          title="Sửa bằng AI"
        >
          <Sparkles size={12} fill="white" />
        </button>
      </div>
    )
  }

  // ── Display Mode ───────────────────────────────────────────────────────────
  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`group relative cursor-text ${className}`}
      style={{ ...style, display: 'inline-block', minHeight: '1em', minWidth: '30px' }}
      title="Click để sửa"
    >
      {richText
        ? (value
          ? <span dangerouslySetInnerHTML={{ __html: value }} />
          : <span style={{ opacity: 0.5, fontStyle: 'italic' }}>{placeholder}</span>)
        : (value || <span style={{ opacity: 0.5, fontStyle: 'italic' }}>{placeholder}</span>)
      }
      
      {/* Magic Wand Icon on Hover */}
      <button
        onClick={handleOpenAiAssistant}
        className="opacity-0 group-hover:opacity-100"
        style={{
          position: 'absolute', right: '-24px', top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer',
          padding: '4px', transition: 'all 0.2s',
        }}
        title="Sửa bằng AI"
      >
        <Sparkles size={16} fill="#c4b5fd" />
      </button>

      {/* Hover effect overlay */}
      <span
        style={{
          position: 'absolute', inset: '-2px',
          border: '1px dashed transparent',
          pointerEvents: 'none', borderRadius: '4px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLSpanElement).style.borderColor = '#8b5cf6'
          ;(e.currentTarget as HTMLSpanElement).style.backgroundColor = 'rgba(139, 92, 246, 0.05)'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLSpanElement).style.borderColor = 'transparent'
          ;(e.currentTarget as HTMLSpanElement).style.backgroundColor = 'transparent'
        }}
      />
    </span>
  )
}
