import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { JOB_TAG_CATEGORIES } from '../../constants/jobTags'
import './TagFilter.css'

type TagFilterProps = {
  selected: string[]
  onChange: (tags: string[]) => void
}

export const TagFilter = ({ selected, onChange }: TagFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })
  const toggleRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const openDropdown = useCallback(() => {
    setIsOpen(true)
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const closeDropdown = useCallback(() => {
    setVisible(false)
    const timeout = window.setTimeout(() => setIsOpen(false), 200)
    return () => window.clearTimeout(timeout)
  }, [])

  const updatePos = useCallback(() => {
    if (!toggleRef.current) return
    const rect = toggleRef.current.getBoundingClientRect()
    setPos({ top: rect.bottom + 6, left: rect.left, width: rect.width })
  }, [])

  useEffect(() => {
    if (!isOpen) return
    updatePos()
    window.addEventListener('scroll', updatePos, true)
    window.addEventListener('resize', updatePos)
    return () => {
      window.removeEventListener('scroll', updatePos, true)
      window.removeEventListener('resize', updatePos)
    }
  }, [isOpen, updatePos])

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        toggleRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return
      closeDropdown()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, closeDropdown])

  const toggle = (tag: string) => {
    onChange(
      selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag],
    )
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return JOB_TAG_CATEGORIES
    const q = search.trim().toLowerCase()
    return JOB_TAG_CATEGORIES.map((cat) => ({
      ...cat,
      tags: cat.tags.filter((t) => t.toLowerCase().includes(q)),
    })).filter((cat) => cat.tags.length > 0)
  }, [search])

  const dropdown = isOpen
    ? createPortal(
        <div
          ref={dropdownRef}
          className={`tag-filter__dropdown ${visible ? 'tag-filter__dropdown--visible' : ''}`}
          style={{ top: pos.top, left: pos.left, width: Math.max(pos.width, 340) }}
        >
          <input
            className="page-ui__input tag-filter__search"
            placeholder="Tìm tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="tag-filter__cats">
            {filtered.map((cat) => {
              const isActive = activeCat === cat.key || search.trim().length > 0
              const selectedCount = cat.tags.filter((t) => selected.includes(t)).length
              return (
                <div key={cat.key} className="tag-filter__cat">
                  <button
                    type="button"
                    className="tag-filter__cat-btn"
                    onClick={() => setActiveCat(isActive && !search.trim() ? null : cat.key)}
                  >
                    <span>{cat.labelVi}</span>
                    {selectedCount > 0 && (
                      <span className="tag-filter__cat-sel">{selectedCount}</span>
                    )}
                    <span className="tag-filter__cat-arrow">{isActive ? '▾' : '▸'}</span>
                  </button>
                  {isActive && (
                    <div className="tag-filter__cat-tags">
                      {cat.tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className={`tag-filter__chip ${selected.includes(tag) ? 'tag-filter__chip--active' : ''}`}
                          onClick={() => toggle(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>,
        document.body,
      )
    : null

  return (
    <div className="tag-filter">
      <button
        ref={toggleRef}
        type="button"
        className="tag-filter__toggle"
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
      >
        <span>🏷️ Lọc theo tags</span>
        {selected.length > 0 && (
          <span className="tag-filter__badge">{selected.length}</span>
        )}
        <span className="tag-filter__arrow">{isOpen ? '▴' : '▾'}</span>
      </button>

      {selected.length > 0 && (
        <div className="tag-filter__selected">
          {selected.map((tag) => (
            <button
              key={tag}
              type="button"
              className="tag-filter__chip tag-filter__chip--active"
              onClick={() => toggle(tag)}
            >
              {tag} ×
            </button>
          ))}
          <button
            type="button"
            className="tag-filter__chip tag-filter__chip--clear"
            onClick={() => onChange([])}
          >
            Xóa tất cả
          </button>
        </div>
      )}

      {dropdown}
    </div>
  )
}
