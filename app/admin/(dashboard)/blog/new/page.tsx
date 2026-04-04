'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TagInput from '@/components/admin/TagInput'
import MarkdownEditor from '@/components/admin/MarkdownEditor'

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const inputCls =
  'w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors'
const inputStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E4E4E8',
  color: '#0A0A0A',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5"
        style={{ color: '#ABABAB' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

export default function NewPostPage() {
  const router = useRouter()
  const today = new Date().toISOString().slice(0, 10)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [date, setDate] = useState(today)
  const [tags, setTags] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleTitleChange = (v: string) => {
    setTitle(v)
    if (!slugManual) setSlug(slugify(v))
  }

  const handleSlugChange = (v: string) => {
    setSlugManual(true)
    setSlug(slugify(v))
  }

  const handleSave = async () => {
    if (!title || !slug) {
      setError('Title and slug are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title, date, tags, description, body }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to create post')
        return
      }
      router.push('/admin/blog')
      router.refresh()
    } catch {
      setError('Something went wrong — please try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
            style={{ backgroundColor: '#F7F7F9', color: '#6B6B6B' }}
            onMouseEnter={e =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = '#EDEDED')
            }
            onMouseLeave={e =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = '#F7F7F9')
            }
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M5 12l7-7M5 12l7 7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: '#0A0A0A' }}>
              New post
            </h1>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !title || !slug}
          className="rounded-xl px-5 py-2 text-sm font-medium transition-colors"
          style={{
            backgroundColor: '#0A0A0A',
            color: '#FFFFFF',
            opacity: saving || !title || !slug ? 0.4 : 1,
            cursor: saving || !title || !slug ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Creating…' : 'Create post'}
        </button>
      </div>

      {error && (
        <div
          className="rounded-2xl px-4 py-3 text-sm mb-4"
          style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
        >
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Meta */}
        <div className="rounded-3xl p-6 space-y-4" style={{ backgroundColor: '#F7F7F9' }}>
          <h3 className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>Meta</h3>
          <Field label="Title">
            <input
              type="text"
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Post title"
              className={inputCls}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
              onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug">
              <input
                type="text"
                value={slug}
                onChange={e => handleSlugChange(e.target.value)}
                placeholder="url-slug"
                className={inputCls}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
              />
            </Field>
            <Field label="Date">
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className={inputCls}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
              />
            </Field>
          </div>
          <Field label="Tags">
            <TagInput tags={tags} onChange={setTags} placeholder="Add tag and press Enter…" />
          </Field>
          <Field label="Description / excerpt">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="One-sentence summary shown on post cards"
              rows={2}
              className={`${inputCls} resize-y`}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
              onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
            />
          </Field>
        </div>

        {/* Body */}
        <div className="rounded-3xl p-6 space-y-3" style={{ backgroundColor: '#F7F7F9' }}>
          <h3 className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>Body</h3>
          <MarkdownEditor
            value={body}
            onChange={setBody}
            placeholder="Write your post in markdown…"
            minHeight={380}
          />
        </div>
      </div>
    </div>
  )
}
