'use client'

import { useState } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write in markdown…',
  minHeight = 320,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write')

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid #E4E4E8' }}
    >
      {/* Tab bar */}
      <div
        className="flex"
        style={{ backgroundColor: '#F7F7F9', borderBottom: '1px solid #E4E4E8' }}
      >
        {(['write', 'preview'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition-colors capitalize"
            style={{
              color: tab === t ? '#0A0A0A' : '#ABABAB',
              backgroundColor: tab === t ? '#FFFFFF' : 'transparent',
              borderBottom: tab === t ? '2px solid #0A0A0A' : '2px solid transparent',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'write' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white outline-none resize-y font-mono text-sm px-4 py-3"
          style={{
            minHeight,
            color: '#0A0A0A',
          }}
        />
      ) : (
        <div
          className="px-4 py-3 overflow-auto"
          style={{ minHeight, backgroundColor: '#FFFFFF' }}
        >
          {value ? (
            <article
              className="prose"
              style={{ maxWidth: 'none' }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(value) as string) }}
            />
          ) : (
            <p className="text-sm" style={{ color: '#ABABAB' }}>
              Nothing to preview yet.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
