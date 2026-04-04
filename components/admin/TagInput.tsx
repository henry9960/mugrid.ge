'use client'

import { useState, KeyboardEvent } from 'react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export default function TagInput({
  tags,
  onChange,
  placeholder = 'Add tag…',
}: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInput('')
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter(t => t !== tag))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div
      className="flex flex-wrap gap-1.5 rounded-xl p-2 transition-colors"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E4E8',
        minHeight: '42px',
      }}
      onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
      onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
    >
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs"
          style={{ backgroundColor: '#F0F0F3', color: '#0A0A0A' }}
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="transition-colors leading-none"
            style={{ color: '#ABABAB' }}
            onMouseEnter={e =>
              ((e.currentTarget as HTMLElement).style.color = '#0A0A0A')
            }
            onMouseLeave={e =>
              ((e.currentTarget as HTMLElement).style.color = '#ABABAB')
            }
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 bg-transparent text-sm outline-none"
        style={{
          minWidth: '100px',
          color: '#0A0A0A',
        }}
      />
    </div>
  )
}
