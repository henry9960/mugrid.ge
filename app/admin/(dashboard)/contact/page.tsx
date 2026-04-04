'use client'

import { useState, useEffect, useRef } from 'react'
import SaveBar, { type SaveStatus } from '@/components/admin/SaveBar'
import type { ContactContent, SocialLink } from '@/lib/types/content'

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

export default function AdminContactPage() {
  const [formData, setFormData] = useState<ContactContent | null>(null)
  const savedData = useRef<ContactContent | null>(null)
  const [status, setStatus] = useState<SaveStatus>('idle')

  useEffect(() => {
    fetch('/api/admin/contact')
      .then(r => r.json())
      .then((d: ContactContent) => {
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
      const res = await fetch('/api/admin/contact', {
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

  const updateSocial = (id: string, patch: Partial<SocialLink>) => {
    setFormData(prev =>
      prev
        ? {
            ...prev,
            socials: prev.socials.map(s =>
              s.id === id ? { ...s, ...patch } : s,
            ),
          }
        : prev,
    )
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#0A0A0A' }}>
            Contact
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#ABABAB' }}>
            Email address and social platform links
          </p>
        </div>
        <SaveBar isDirty={isDirty} status={status} onSave={save} />
      </div>

      <div className="space-y-4">

        {/* Section */}
        <div className="rounded-3xl p-6 space-y-4" style={{ backgroundColor: '#F7F7F9' }}>
          <h3 className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>Section</h3>
          <Field label="Section heading">
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
          </Field>
        </div>

        {/* Email */}
        <div className="rounded-3xl p-6 space-y-4" style={{ backgroundColor: '#F7F7F9' }}>
          <h3 className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>Email</h3>
          <Field label="Email address">
            <input
              type="email"
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={inputCls}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
              onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
            />
          </Field>
        </div>

        {/* Socials */}
        <div className="rounded-3xl p-6 space-y-5" style={{ backgroundColor: '#F7F7F9' }}>
          <h3 className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>Social Links</h3>
          {formData.socials.map(social => (
            <div
              key={social.id}
              className="rounded-2xl p-4 space-y-3"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E4E8' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>
                  {social.platform}
                </span>
                {/* Enabled toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: '#ABABAB' }}>
                    {social.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateSocial(social.id, { enabled: !social.enabled })
                    }
                    className="relative w-9 h-5 rounded-full flex-shrink-0 transition-colors"
                    style={{
                      backgroundColor: social.enabled ? '#3A7D44' : '#D4D4D8',
                    }}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
                      style={{
                        backgroundColor: '#FFFFFF',
                        left: social.enabled ? '18px' : '2px',
                      }}
                    />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Handle">
                  <input
                    type="text"
                    value={social.handle}
                    onChange={e =>
                      updateSocial(social.id, { handle: e.target.value })
                    }
                    className={inputCls}
                    style={{ ...inputStyle, backgroundColor: '#F7F7F9' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
                  />
                </Field>
                <Field label="URL">
                  <input
                    type="url"
                    value={social.url}
                    onChange={e =>
                      updateSocial(social.id, { url: e.target.value })
                    }
                    className={inputCls}
                    style={{ ...inputStyle, backgroundColor: '#F7F7F9' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
