import { useState, useMemo } from 'react'
import { JOB_TAG_CATEGORIES } from '../../constants/jobTags'
import './TagPicker.css'

type TagPickerProps = {
  selected: string[]
  onChange: (tags: string[]) => void
  maxVisible?: number
}

export const TagPicker = ({ selected, onChange, maxVisible = 30 }: TagPickerProps) => {
  const [search, setSearch] = useState('')
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set())

  const toggleCat = (key: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

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

  const isSearching = search.trim().length > 0

  return (
    <div className="tag-picker">
      {selected.length > 0 && (
        <div className="tag-picker__selected">
          {selected.map((tag) => (
            <button
              key={tag}
              type="button"
              className="tag-picker__chip tag-picker__chip--active"
              onClick={() => toggle(tag)}
            >
              {tag} ×
            </button>
          ))}
          <button
            type="button"
            className="tag-picker__clear"
            onClick={() => onChange([])}
          >
            Xóa tất cả
          </button>
        </div>
      )}

      <input
        className="page-ui__input tag-picker__search"
        placeholder="Tìm tag..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="tag-picker__categories">
        {filtered.map((cat) => {
          const isExpanded = isSearching || expandedCats.has(cat.key)
          const visibleTags = isExpanded ? cat.tags : cat.tags.slice(0, maxVisible)
          const hasMore = !isExpanded && cat.tags.length > maxVisible

          return (
            <div key={cat.key} className="tag-picker__cat">
              <button
                type="button"
                className="tag-picker__cat-header"
                onClick={() => toggleCat(cat.key)}
              >
                <span className="tag-picker__cat-icon">{isExpanded ? '▾' : '▸'}</span>
                <span>{cat.labelVi}</span>
                <span className="tag-picker__cat-count">
                  {cat.tags.filter((t) => selected.includes(t)).length > 0
                    ? `(${cat.tags.filter((t) => selected.includes(t)).length} đã chọn)`
                    : `(${cat.tags.length})`}
                </span>
              </button>

              {(isExpanded || !isSearching) && (
                <div className="tag-picker__tags">
                  {visibleTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-picker__chip ${selected.includes(tag) ? 'tag-picker__chip--active' : ''}`}
                      onClick={() => toggle(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                  {hasMore && (
                    <button
                      type="button"
                      className="tag-picker__more"
                      onClick={() => toggleCat(cat.key)}
                    >
                      +{cat.tags.length - maxVisible} more
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
