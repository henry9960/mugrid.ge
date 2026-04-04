'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import SaveBar, { type SaveStatus } from '@/components/admin/SaveBar'
import type { ThoughtsContent } from '@/lib/types/content'

const inputCls =
  'w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors'
const inputStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E4E8',
  color: '#0A0A0A',
}

export default function AdminThoughtsPage() {
  const [formData, setFormData] = useState<ThoughtsContent | null>(null)
  const savedData = useRef<ThoughtsContent | null>(null)
  const [status, setStatus] = useState<SaveStatus>('idle')

  useEffect(() => {
    fetch('/api/admin/thoughts')
      .then(r => r.json())
      .then((d: ThoughtsContent) => {
        savedData.current = d
        setFormData(structuredClone(d))
      })
  }, [])

  const isDirty =
    formData !== null &&
    JSON.stringify(formData) !== JSON.stringify(savedData.current)

  const save = async () => {
    if (!formData) return
    setStatus('saving')
    try {
      const res = await fetch('/api/admin/thoughts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error()
      savedData.current = structuredClone(formData)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  if (!formData) {
    return (
      <div className="p-8">
        <p className="text-sm" style={{ color: '#ABABAB' }}>Loading…</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#0A0A0A' }}>
            Thoughts
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#ABABAB' }}>
            Section heading for the "My thoughts" blog preview on the homepage
          </p>
        </div>
        <SaveBar isDirty={isDirty} status={status} onSave={save} />
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl p-6 space-y-4" style={{ backgroundColor: '#F7F7F9' }}>
          <h3 className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>Section</h3>
          <div>
            <label
              className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: '#ABABAB' }}
            >
              Section heading
            </label>
            <input
              type="text"
              value={formData.sectionHeading}
              onChange={e =>
                setFormData({ ...formData, sectionHeading: e.target.value })
              }
              className={inputCls}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
              onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
            />
          </div>
        </div>

        {/* Link to blog post management */}
        <div className="rounded-3xl p-6" style={{ backgroundColor: '#F7F7F9' }}>
          <h3 className="text-sm font-semibold mb-1" style={{ color: '#0A0A0A' }}>Posts</h3>
          <p className="text-sm mb-4" style={{ color: '#6B6B6B' }}>
            Manage individual blog posts from the Blog section.
          </p>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF' }}
          >
            Go to Blog management
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
