'use client'

import { useState, useEffect, useRef } from 'react'
import SaveBar, { type SaveStatus } from '@/components/admin/SaveBar'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import type { AboutContent, AboutBlock, TimelineEntry, TimelineState } from '@/lib/types/content'

function focusBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = '#0A0A0A'
}
function blurBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = '#E4E4E8'
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

function StateSelect({
  value,
  onChange,
}: {
  value: TimelineState
  onChange: (v: TimelineState) => void
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as TimelineState)}
      className="rounded-xl px-3 py-2.5 text-sm outline-none transition-colors appearance-none"
      style={{ ...inputStyle, paddingRight: '2rem', cursor: 'pointer' }}
      onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
      onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
    >
      <option value="active">Active (animated border)</option>
      <option value="highlighted">Highlighted (expandable card)</option>
      <option value="inactive">Inactive (muted row)</option>
    </select>
  )
}

export default function AdminAboutPage() {
  const [formData, setFormData] = useState<AboutContent | null>(null)
  const savedData = useRef<AboutContent | null>(null)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'block' | 'entry'
    id: string
  } | null>(null)

  useEffect(() => {
    fetch('/api/admin/about')
      .then(r => r.json())
      .then((d: AboutContent) => {
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
      const res = await fetch('/api/admin/about', {
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

  /* ── Block helpers ── */
  const updateBlock = (id: string, patch: Partial<AboutBlock>) =>
    setFormData(prev =>
      prev
        ? {
            ...prev,
            blocks: prev.blocks.map(b => (b.id === id ? { ...b, ...patch } : b)),
          }
        : prev,
    )

  const addBlock = () => {
    const id = `block_${Date.now()}`
    setFormData(prev =>
      prev
        ? { ...prev, blocks: [...prev.blocks, { id, label: '', text: '' }] }
        : prev,
    )
  }

  const deleteBlock = (id: string) => {
    setFormData(prev =>
      prev ? { ...prev, blocks: prev.blocks.filter(b => b.id !== id) } : prev,
    )
    setDeleteConfirm(null)
  }

  const moveBlock = (id: string, dir: -1 | 1) => {
    setFormData(prev => {
      if (!prev) return prev
      const idx = prev.blocks.findIndex(b => b.id === id)
      if (idx < 0) return prev
      const newIdx = idx + dir
      if (newIdx < 0 || newIdx >= prev.blocks.length) return prev
      const arr = [...prev.blocks]
      ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
      return { ...prev, blocks: arr }
    })
  }

  /* ── Timeline helpers ── */
  const updateEntry = (id: string, patch: Partial<TimelineEntry>) =>
    setFormData(prev =>
      prev
        ? {
            ...prev,
            timeline: prev.timeline.map(e =>
              e.id === id ? { ...e, ...patch } : e,
            ),
          }
        : prev,
    )

  const addEntry = () => {
    const id = `entry_${Date.now()}`
    const newEntry: TimelineEntry = {
      id,
      company: '',
      role: '',
      description: '',
      period: '',
      state: 'inactive',
    }
    setFormData(prev =>
      prev ? { ...prev, timeline: [...prev.timeline, newEntry] } : prev,
    )
    setEditingEntry(id)
  }

  const deleteEntry = (id: string) => {
    setFormData(prev =>
      prev
        ? { ...prev, timeline: prev.timeline.filter(e => e.id !== id) }
        : prev,
    )
    if (editingEntry === id) setEditingEntry(null)
    setDeleteConfirm(null)
  }

  const moveEntry = (id: string, dir: -1 | 1) => {
    setFormData(prev => {
      if (!prev) return prev
      const idx = prev.timeline.findIndex(e => e.id === id)
      if (idx < 0) return prev
      const newIdx = idx + dir
      if (newIdx < 0 || newIdx >= prev.timeline.length) return prev
      const arr = [...prev.timeline]
      ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
      return { ...prev, timeline: arr }
    })
  }

  const handleLogoUpload = async (entryId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      const { url } = await res.json() as { url: string }
      updateEntry(entryId, { logoUrl: url })
    } catch {
      alert('Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  if (!formData) {
    return (
      <div className="p-8">
        <p className="text-sm" style={{ color: '#ABABAB' }}>Loading…</p>
      </div>
    )
  }

  const stateColor: Record<TimelineState, string> = {
    active: '#3A7D44',
    highlighted: '#1D4ED8',
    inactive: '#ABABAB',
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#0A0A0A' }}>
            About
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#ABABAB' }}>
            Section heading, about blocks, and career timeline
          </p>
        </div>
        <SaveBar isDirty={isDirty} status={status} onSave={save} />
      </div>

      <div className="space-y-4">

        {/* Section heading */}
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
          <Field label="Location">
            <input
              type="text"
              value={formData.location}
              onChange={e =>
                setFormData({ ...formData, location: e.target.value })
              }
              className={inputCls}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
              onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
            />
          </Field>
        </div>

        {/* About blocks */}
        <div className="rounded-3xl p-6 space-y-4" style={{ backgroundColor: '#F7F7F9' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>
              About Blocks
            </h3>
            <button
              onClick={addBlock}
              className="text-xs font-medium rounded-xl px-3 py-1.5 transition-colors"
              style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF' }}
            >
              + Add block
            </button>
          </div>

          {formData.blocks.map((block, idx) => (
            <div
              key={block.id}
              className="rounded-2xl p-4 space-y-3"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E4E8' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: '#ABABAB' }}>
                  Block {idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveBlock(block.id, -1)}
                    disabled={idx === 0}
                    className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
                    style={{ backgroundColor: '#F7F7F9', color: '#6B6B6B' }}
                    title="Move up"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveBlock(block.id, 1)}
                    disabled={idx === formData.blocks.length - 1}
                    className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
                    style={{ backgroundColor: '#F7F7F9', color: '#6B6B6B' }}
                    title="Move down"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirm({ type: 'block', id: block.id })
                    }
                    className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
                    style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
                    title="Delete block"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Label">
                  <input
                    type="text"
                    value={block.label}
                    onChange={e => updateBlock(block.id, { label: e.target.value })}
                    className={inputCls}
                    style={{ ...inputStyle, backgroundColor: '#F7F7F9' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
                  />
                </Field>
                <div className="col-span-2">
                  <Field label="Text">
                    <textarea
                      value={block.text}
                      onChange={e => updateBlock(block.id, { text: e.target.value })}
                      rows={3}
                      className={`${inputCls} resize-y`}
                      style={{ ...inputStyle, backgroundColor: '#F7F7F9' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
                    />
                  </Field>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="rounded-3xl p-6 space-y-4" style={{ backgroundColor: '#F7F7F9' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>
                Timeline
              </h3>
              <p className="text-xs mt-0.5" style={{ color: '#ABABAB' }}>
                Career and education entries (shown newest first)
              </p>
            </div>
            <button
              onClick={addEntry}
              className="text-xs font-medium rounded-xl px-3 py-1.5 transition-colors"
              style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF' }}
            >
              + Add entry
            </button>
          </div>

          {formData.timeline.map((entry, idx) => {
            const isEditing = editingEntry === entry.id
            return (
              <div
                key={entry.id}
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid #E4E4E8' }}
              >
                {/* Entry header row */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer"
                  style={{ backgroundColor: '#FFFFFF' }}
                  onClick={() =>
                    setEditingEntry(isEditing ? null : entry.id)
                  }
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="text-[9px] font-semibold uppercase rounded-full px-2 py-0.5 flex-shrink-0"
                      style={{
                        color: stateColor[entry.state],
                        backgroundColor:
                          entry.state === 'active'
                            ? '#EDFAF1'
                            : entry.state === 'highlighted'
                              ? '#EFF6FF'
                              : '#F4F4F5',
                      }}
                    >
                      {entry.state}
                    </span>
                    <span className="text-sm font-semibold truncate" style={{ color: '#0A0A0A' }}>
                      {entry.company || 'Untitled'}
                    </span>
                    <span className="text-xs truncate hidden sm:block" style={{ color: '#ABABAB' }}>
                      {entry.period}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        moveEntry(entry.id, -1)
                      }}
                      disabled={idx === 0}
                      className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
                      style={{ backgroundColor: '#F7F7F9', color: '#6B6B6B' }}
                      title="Move up"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 15l-6-6-6 6" />
                      </svg>
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        moveEntry(entry.id, 1)
                      }}
                      disabled={idx === formData.timeline.length - 1}
                      className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
                      style={{ backgroundColor: '#F7F7F9', color: '#6B6B6B' }}
                      title="Move down"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        setDeleteConfirm({ type: 'entry', id: entry.id })
                      }}
                      className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
                      style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
                      title="Delete entry"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                    </button>
                    <svg
                      width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="#ABABAB" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{
                        transition: 'transform 0.2s ease',
                        transform: isEditing ? 'rotate(180deg)' : 'rotate(0deg)',
                        marginLeft: '2px',
                      }}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>

                {/* Expandable edit form */}
                {isEditing && (
                  <div
                    className="p-4 space-y-3"
                    style={{ backgroundColor: '#F7F7F9', borderTop: '1px solid #E4E4E8' }}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Company">
                        <input
                          type="text"
                          value={entry.company}
                          onChange={e => updateEntry(entry.id, { company: e.target.value })}
                          className={inputCls}
                          style={inputStyle}
                          onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
                        />
                      </Field>
                      <Field label="Role">
                        <input
                          type="text"
                          value={entry.role}
                          onChange={e => updateEntry(entry.id, { role: e.target.value })}
                          className={inputCls}
                          style={inputStyle}
                          onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
                        />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Period">
                        <input
                          type="text"
                          value={entry.period}
                          onChange={e => updateEntry(entry.id, { period: e.target.value })}
                          placeholder="e.g. Jun – Sep '25"
                          className={inputCls}
                          style={inputStyle}
                          onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
                        />
                      </Field>
                      <Field label="State">
                        <StateSelect
                          value={entry.state}
                          onChange={v => updateEntry(entry.id, { state: v })}
                        />
                      </Field>
                    </div>
                    <Field label="Short description">
                      <input
                        type="text"
                        value={entry.description}
                        onChange={e => updateEntry(entry.id, { description: e.target.value })}
                        className={inputCls}
                        style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
                      />
                    </Field>
                    {(entry.state === 'highlighted' || entry.state === 'active') && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Badge label (optional)">
                            <input
                              type="text"
                              value={entry.badgeLabel ?? ''}
                              onChange={e =>
                                updateEntry(entry.id, {
                                  badgeLabel: e.target.value || undefined,
                                })
                              }
                              placeholder="e.g. Key exp."
                              className={inputCls}
                              style={inputStyle}
                              onFocus={focusBorder}
                              onBlur={blurBorder}
                            />
                          </Field>
                          <Field label="Page link (optional)">
                            <input
                              type="text"
                              value={entry.href ?? ''}
                              onChange={e =>
                                updateEntry(entry.id, {
                                  href: e.target.value || undefined,
                                })
                              }
                              placeholder="e.g. /microsoft"
                              className={inputCls}
                              style={inputStyle}
                              onFocus={focusBorder}
                              onBlur={blurBorder}
                            />
                          </Field>
                        </div>
                        <Field label="Expandable detail (optional)">
                          <textarea
                            value={entry.detail ?? ''}
                            onChange={e =>
                              updateEntry(entry.id, {
                                detail: e.target.value || undefined,
                              })
                            }
                            rows={3}
                            placeholder="Details shown when user expands this card"
                            className={`${inputCls} resize-y`}
                            style={inputStyle}
                            onFocus={focusBorder}
                            onBlur={blurBorder}
                          />
                        </Field>
                      </>
                    )}
                    {entry.state === 'active' && (
                      <>
                        <div
                          className="rounded-xl px-3.5 py-2.5 flex items-center gap-2"
                          style={{ backgroundColor: '#EDFAF1', border: '1px solid #BBF7D0' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#3A7D44' }} />
                          <span className="text-xs font-medium" style={{ color: '#3A7D44' }}>
                            This entry drives the &ldquo;What I&apos;m up to&rdquo; card
                          </span>
                        </div>
                        <Field label="Company logo">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                              style={{ backgroundColor: '#EDEDED' }}
                            >
                              {entry.logoUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={entry.logoUrl} alt="logo" className="w-full h-full object-contain p-1.5" />
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                                </svg>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <span className="rounded-xl px-3.5 py-2 text-sm font-medium" style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF' }}>
                                  {uploading ? 'Uploading…' : 'Upload logo'}
                                </span>
                                <input type="file" accept="image/*" className="hidden" onChange={e => handleLogoUpload(entry.id, e)} disabled={uploading} />
                              </label>
                              {entry.logoUrl && (
                                <button onClick={() => updateEntry(entry.id, { logoUrl: null })} className="text-xs text-left" style={{ color: '#DC2626' }}>
                                  Remove logo
                                </button>
                              )}
                            </div>
                          </div>
                        </Field>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Learning">
                            <input
                              type="text"
                              value={entry.learning ?? ''}
                              onChange={e => updateEntry(entry.id, { learning: e.target.value || undefined })}
                              placeholder="e.g. Vibecoding with Claude"
                              className={inputCls}
                              style={inputStyle}
                              onFocus={focusBorder}
                              onBlur={blurBorder}
                            />
                          </Field>
                          <Field label="Location">
                            <input
                              type="text"
                              value={entry.location ?? ''}
                              onChange={e => updateEntry(entry.id, { location: e.target.value || undefined })}
                              placeholder="e.g. London, United Kingdom"
                              className={inputCls}
                              style={inputStyle}
                              onFocus={focusBorder}
                              onBlur={blurBorder}
                            />
                          </Field>
                        </div>
                      </>
                    )}
                    {entry.state === 'inactive' && (
                      <Field label="Page link (optional)">
                        <input
                          type="text"
                          value={entry.href ?? ''}
                          onChange={e =>
                            updateEntry(entry.id, {
                              href: e.target.value || undefined,
                            })
                          }
                          placeholder="e.g. /microsoft"
                          className={inputCls}
                          style={inputStyle}
                          onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
                        />
                      </Field>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>

      <ConfirmDialog
        open={deleteConfirm !== null}
        title={
          deleteConfirm?.type === 'block'
            ? 'Delete about block?'
            : 'Delete timeline entry?'
        }
        message="This action cannot be undone until you save."
        confirmLabel="Delete"
        onConfirm={() => {
          if (!deleteConfirm) return
          if (deleteConfirm.type === 'block') deleteBlock(deleteConfirm.id)
          else deleteEntry(deleteConfirm.id)
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}
