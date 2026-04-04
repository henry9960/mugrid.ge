'use client'

import { useState, useEffect, useRef } from 'react'
import SaveBar, { type SaveStatus } from '@/components/admin/SaveBar'
import type { MusicContent, MusicTrack } from '@/lib/types/content'

const inputCls = 'w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors'
const inputStyle = { backgroundColor: '#FFFFFF', border: '1px solid #E4E4E8', color: '#0A0A0A' }

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#ABABAB' }}>
        {label}
      </label>
      {hint && <p className="text-[11px] mb-1.5" style={{ color: '#ABABAB' }}>{hint}</p>}
      {children}
    </div>
  )
}

function focusBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = '#0A0A0A'
}
function blurBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = '#E4E4E8'
}

export default function AdminMusicPage() {
  const [data, setData] = useState<MusicContent | null>(null)
  const savedData = useRef<MusicContent | null>(null)
  const [status, setStatus] = useState<SaveStatus>('idle')

  useEffect(() => {
    fetch('/api/admin/music')
      .then(r => r.json())
      .then((d: MusicContent) => {
        savedData.current = d
        setData(structuredClone(d))
      })
  }, [])

  const isDirty = data !== null && JSON.stringify(data) !== JSON.stringify(savedData.current)

  const save = async () => {
    if (!data) return
    setStatus('saving')
    try {
      const res = await fetch('/api/admin/music', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      savedData.current = structuredClone(data)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const setTrack = (i: number, patch: Partial<MusicTrack>) =>
    setData(prev => {
      if (!prev) return prev
      const tracks = prev.tracks.map((t, idx) => idx === i ? { ...t, ...patch } : t)
      return { ...prev, tracks }
    })

  const addTrack = () =>
    setData(prev => prev ? {
      ...prev,
      tracks: [...prev.tracks, { title: '', artist: '', album: '', albumArtUrl: null, src: '', startTime: 0 }],
    } : prev)

  const removeTrack = (i: number) =>
    setData(prev => prev ? { ...prev, tracks: prev.tracks.filter((_, idx) => idx !== i) } : prev)

  const moveTrack = (i: number, dir: -1 | 1) =>
    setData(prev => {
      if (!prev) return prev
      const tracks = [...prev.tracks]
      const j = i + dir
      if (j < 0 || j >= tracks.length) return prev
      ;[tracks[i], tracks[j]] = [tracks[j], tracks[i]]
      return { ...prev, tracks }
    })

  if (!data) return <div className="p-8"><p className="text-sm" style={{ color: '#ABABAB' }}>Loading…</p></div>

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#0A0A0A' }}>Music</h1>
          <p className="text-xs mt-0.5" style={{ color: '#ABABAB' }}>
            Tracks shown in the music player card. Place audio files in /public/music/.
          </p>
        </div>
        <SaveBar isDirty={isDirty} status={status} onSave={save} />
      </div>

      <div className="space-y-3">
        {data.tracks.map((track, i) => (
          <div key={i} className="rounded-3xl p-6 space-y-4" style={{ backgroundColor: '#F7F7F9' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold" style={{ color: '#0A0A0A' }}>
                Track {i + 1}{track.title ? ` — ${track.title}` : ''}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveTrack(i, -1)}
                  disabled={i === 0}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
                  style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
                  title="Move up"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                </button>
                <button
                  onClick={() => moveTrack(i, 1)}
                  disabled={i === data.tracks.length - 1}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
                  style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
                  title="Move down"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <button
                  onClick={() => removeTrack(i)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors ml-1"
                  style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
                  title="Remove track"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Title">
                <input type="text" value={track.title} onChange={e => setTrack(i, { title: e.target.value })}
                  className={inputCls} style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
              </Field>
              <Field label="Artist">
                <input type="text" value={track.artist} onChange={e => setTrack(i, { artist: e.target.value })}
                  className={inputCls} style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
              </Field>
            </div>

            <Field label="Audio file path" hint="e.g. /music/my-track.mp3">
              <input type="text" value={track.src} onChange={e => setTrack(i, { src: e.target.value })}
                className={inputCls} style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}
                placeholder="/music/filename.mp3" />
            </Field>

            <Field label="Album art path" hint="e.g. /music/art/cover.jpg — leave blank for gradient">
              <input type="text" value={track.albumArtUrl ?? ''} onChange={e => setTrack(i, { albumArtUrl: e.target.value || null })}
                className={inputCls} style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}
                placeholder="/music/art/cover.jpg" />
            </Field>

            <Field label="Start time (seconds)" hint="Playback begins at this offset">
              <input type="number" min="0" value={track.startTime} onChange={e => setTrack(i, { startTime: Number(e.target.value) })}
                className={`${inputCls} w-32`} style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
            </Field>
          </div>
        ))}

        <button
          onClick={addTrack}
          className="w-full rounded-2xl py-3 text-sm font-medium transition-colors"
          style={{ backgroundColor: '#F7F7F9', color: '#6B6B6B', border: '1.5px dashed #D4D4D8' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ABABAB'; (e.currentTarget as HTMLElement).style.color = '#0A0A0A' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#D4D4D8'; (e.currentTarget as HTMLElement).style.color = '#6B6B6B' }}
        >
          + Add track
        </button>
      </div>
    </div>
  )
}
