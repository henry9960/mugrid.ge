'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import TagInput from '@/components/admin/TagInput'
import MarkdownEditor from '@/components/admin/MarkdownEditor'
import SaveBar, { type SaveStatus } from '@/components/admin/SaveBar'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

interface PostForm {
  title: string
  slug: string
  date: string
  tags: string[]
  description: string
  body: string
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

export default function EditPostClient() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const [formData, setFormData] = useState<PostForm | null>(null)
  const savedData = useRef<PostForm | null>(null)
  const [slugManual, setSlugManual] = useState(false)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/admin/posts?slug=${slug}`)
      .then(r => r.json())
      .then((d: PostForm) => {
        savedData.current = d
        setFormData(structuredClone(d))
      })
  }, [slug])

  const isDirty =
    formData !== null &&
    JSON.stringify(formData) !== JSON.stringify(savedData.current)

  const set = <K extends keyof PostForm>(key: K, value: PostForm[K]) =>
    setFormData(prev => (prev ? { ...prev, [key]: value } : prev))

  const handleTitleChange = (v: string) => {
    set('title', v)
    if (!slugManual) set('slug', slugify(v))
  }

  const handleSlugChange = (v: string) => {
    setSlugManual(true)
    set('slug', slugify(v))
  }

  const save = async () => {
    if (!formData) return
    setStatus('saving')
    setError('')
    try {
      const res = await fetch(`/api/admin/posts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slug,
          newSlug: formData.slug !== slug ? formData.slug : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to save')
        setStatus('error')
        return
      }
      savedData.current = structuredClone(formData)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2500)
      // If slug changed, redirect to new URL
      if (data.slug !== slug) {
        router.replace(`/admin/blog/${data.slug}`)
      }
    } catch {
      setStatus('error')
      setError('Something went wrong — please try again')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const handleDelete = async () => {
    await fetch(`/api/admin/posts?slug=${slug}`, { method: 'DELETE' })
    router.push('/admin/blog')
    router.refresh()
  }

  if (!formData) {
    return (
      <div className="p-8">
        <p className="text-sm" style={{ color: '#ABABAB' }}>Loading…</p>
      </div>
    )
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
            <h1 className="text-xl font-semibold truncate max-w-[300px]" style={{ color: '#0A0A0A' }}>
              {formData.title || 'Untitled post'}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#ABABAB' }}>
              /blog/{slug}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeleteOpen(true)}
            className="rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
            onMouseEnter={e =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = '#FEE2E2')
            }
            onMouseLeave={e =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = '#FEF2F2')
            }
          >
            Delete
          </button>
          <SaveBar isDirty={isDirty} status={status} onSave={save} />
        </div>
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
              value={formData.title}
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
                value={formData.slug}
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
                value={formData.date}
                onChange={e => set('date', e.target.value)}
                className={inputCls}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
              />
            </Field>
          </div>
          <Field label="Tags">
            <TagInput tags={formData.tags} onChange={v => set('tags', v)} placeholder="Add tag and press Enter…" />
          </Field>
          <Field label="Description / excerpt">
            <textarea
              value={formData.description}
              onChange={e => set('description', e.target.value)}
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
            value={formData.body}
            onChange={v => set('body', v)}
            placeholder="Write your post in markdown…"
            minHeight={380}
          />
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete this post?"
        message={`"${formData.title}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete post"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  )
}
