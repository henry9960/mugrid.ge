'use client'

import { useState, useEffect, useRef } from 'react'
import SaveBar, { type SaveStatus } from '@/components/admin/SaveBar'
import type { HomeContent } from '@/lib/types/content'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#ABABAB' }}>
        {label}
      </label>
      {hint && <p className="text-[11px] mb-1.5" style={{ color: '#ABABAB' }}>{hint}</p>}
      {children}
    </div>
  )
}

const inputCls = 'w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors'
const inputStyle = { backgroundColor: '#FFFFFF', border: '1px solid #E4E4E8', color: '#0A0A0A' }

function focusBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = '#0A0A0A'
}
function blurBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = '#E4E4E8'
}

export default function AdminHomePage() {
  const [formData, setFormData] = useState<HomeContent | null>(null)
  const savedData = useRef<HomeContent | null>(null)
  const [status, setStatus] = useState<SaveStatus>('idle')

  useEffect(() => {
    fetch('/api/admin/home')
      .then(r => r.json())
      .then((d: HomeContent) => {
        savedData.current = d
        setFormData(structuredClone(d))
      })
  }, [])

  const isDirty = formData !== null && JSON.stringify(formData) !== JSON.stringify(savedData.current)

  const save = async () => {
    if (!formData) return
    setStatus('saving')
    try {
      const res = await fetch('/api/admin/home', {
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

  const set = <K extends keyof HomeContent>(key: K, value: HomeContent[K]) =>
    setFormData(prev => (prev ? { ...prev, [key]: value } : prev))

  if (!formData) {
    return <div className="p-8"><p className="text-sm" style={{ color: '#ABABAB' }}>Loading…</p></div>
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#0A0A0A' }}>Home</h1>
          <p className="text-xs mt-0.5" style={{ color: '#ABABAB' }}>Hero section, bio, status, and current role card</p>
        </div>
        <SaveBar isDirty={isDirty} status={status} onSave={save} />
      </div>

      <div className="space-y-4">

        {/* Hero */}
        <div className="rounded-3xl p-6 space-y-4" style={{ backgroundColor: '#F7F7F9' }}>
          <h3 className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>Hero</h3>
          <Field label="Name">
            <input type="text" value={formData.name} onChange={e => set('name', e.target.value)}
              className={inputCls} style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
          <Field label="Tagline">
            <input type="text" value={formData.tagline} onChange={e => set('tagline', e.target.value)}
              className={inputCls} style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
        </div>

        {/* Bio */}
        <div className="rounded-3xl p-6 space-y-4" style={{ backgroundColor: '#F7F7F9' }}>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>Bio</h3>
            <p className="text-xs mt-0.5" style={{ color: '#ABABAB' }}>Separate paragraphs with a blank line.</p>
          </div>
          <Field label="Bio text">
            <textarea value={formData.bio} onChange={e => set('bio', e.target.value)}
              rows={6} className={`${inputCls} resize-y`} style={inputStyle}
              onFocus={focusBorder} onBlur={blurBorder} />
          </Field>
        </div>

        {/* Now status */}
        <div className="rounded-3xl p-6 space-y-4" style={{ backgroundColor: '#F7F7F9' }}>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>Now</h3>
            <p className="text-xs mt-0.5" style={{ color: '#ABABAB' }}>
              A short line shown at the bottom of the hero card. e.g. &ldquo;Vibecoding with Claude&rdquo; or &ldquo;Reading The Hard Thing About Hard Things&rdquo;
            </p>
          </div>
          <Field label="Status text">
            <input type="text" value={formData.nowStatus} onChange={e => set('nowStatus', e.target.value)}
              className={inputCls} style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}
              placeholder="What are you up to right now?" />
          </Field>
          {formData.nowStatus && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#ABABAB' }}>Preview</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5" style={{ backgroundColor: '#EDEDED', color: '#6B6B6B' }}>
                <span className="text-sm leading-none">✦</span>
                {formData.nowStatus}
              </span>
            </div>
          )}
        </div>

        {/* Current role hint */}
        <div className="rounded-2xl px-4 py-3 flex items-center gap-2.5" style={{ backgroundColor: '#F7F7F9', border: '1px solid #E4E4E8' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>
            The &ldquo;What I&apos;m up to&rdquo; card is driven by whichever <strong>Timeline</strong> entry is marked <strong>Active</strong>. Edit it in the <strong>About</strong> section.
          </p>
        </div>

      </div>
    </div>
  )
}
