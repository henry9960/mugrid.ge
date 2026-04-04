'use client'

import { useState, useEffect, useRef } from 'react'
import SaveBar, { type SaveStatus } from '@/components/admin/SaveBar'
import type { GalleryContent, GalleryPhoto } from '@/lib/types/content'

const inputCls = 'w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors'
const inputStyle = { backgroundColor: '#FFFFFF', border: '1px solid #E4E4E8', color: '#0A0A0A' }

function focusBorder(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = '#0A0A0A'
}
function blurBorder(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = '#E4E4E8'
}

export default function AdminGalleryPage() {
  const [data, setData] = useState<GalleryContent | null>(null)
  const savedData = useRef<GalleryContent | null>(null)
  const [status, setStatus] = useState<SaveStatus>('idle')

  useEffect(() => {
    fetch('/api/admin/gallery')
      .then(r => r.json())
      .then((d: GalleryContent) => {
        savedData.current = d
        setData(structuredClone(d))
      })
  }, [])

  const isDirty = data !== null && JSON.stringify(data) !== JSON.stringify(savedData.current)

  const save = async () => {
    if (!data) return
    setStatus('saving')
    try {
      const res = await fetch('/api/admin/gallery', {
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

  const setPhoto = (i: number, patch: Partial<GalleryPhoto>) =>
    setData(prev => {
      if (!prev) return prev
      const photos = prev.photos.map((p, idx) => idx === i ? { ...p, ...patch } : p)
      return { ...prev, photos }
    })

  const addPhoto = () =>
    setData(prev => prev ? { ...prev, photos: [...prev.photos, { src: '' }] } : prev)

  const removePhoto = (i: number) =>
    setData(prev => prev ? { ...prev, photos: prev.photos.filter((_, idx) => idx !== i) } : prev)

  const movePhoto = (i: number, dir: -1 | 1) =>
    setData(prev => {
      if (!prev) return prev
      const photos = [...prev.photos]
      const j = i + dir
      if (j < 0 || j >= photos.length) return prev
      ;[photos[i], photos[j]] = [photos[j], photos[i]]
      return { ...prev, photos }
    })

  if (!data) return <div className="p-8"><p className="text-sm" style={{ color: '#ABABAB' }}>Loading…</p></div>

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#0A0A0A' }}>Gallery</h1>
          <p className="text-xs mt-0.5" style={{ color: '#ABABAB' }}>
            Photos in the gallery carousel. Place image files in /public/gallery/.
          </p>
        </div>
        <SaveBar isDirty={isDirty} status={status} onSave={save} />
      </div>

      <div className="space-y-3">
        {data.photos.map((photo, i) => (
          <div key={i} className="rounded-3xl p-5" style={{ backgroundColor: '#F7F7F9' }}>
            <div className="flex items-center gap-3">
              {/* Thumbnail */}
              <div
                className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: '#E4E4E8' }}
              >
                {photo.src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo.src} alt="" className="w-full h-full object-cover" />
                )}
              </div>

              {/* Fields */}
              <div className="flex-1 min-w-0 space-y-2">
                <input
                  type="text"
                  value={photo.src}
                  onChange={e => setPhoto(i, { src: e.target.value })}
                  className={inputCls}
                  style={inputStyle}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                  placeholder="/gallery/photo.jpg"
                />
                <input
                  type="text"
                  value={photo.caption ?? ''}
                  onChange={e => setPhoto(i, { caption: e.target.value || undefined })}
                  className={inputCls}
                  style={{ ...inputStyle, fontSize: '12px' }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                  placeholder="Caption (optional)"
                />
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => movePhoto(i, -1)}
                  disabled={i === 0}
                  className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30"
                  style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
                  title="Move up"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                </button>
                <button
                  onClick={() => movePhoto(i, 1)}
                  disabled={i === data.photos.length - 1}
                  className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30"
                  style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
                  title="Move down"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <button
                  onClick={() => removePhoto(i)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
                  title="Remove"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addPhoto}
          className="w-full rounded-2xl py-3 text-sm font-medium transition-colors"
          style={{ backgroundColor: '#F7F7F9', color: '#6B6B6B', border: '1.5px dashed #D4D4D8' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ABABAB'; (e.currentTarget as HTMLElement).style.color = '#0A0A0A' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#D4D4D8'; (e.currentTarget as HTMLElement).style.color = '#6B6B6B' }}
        >
          + Add photo
        </button>
      </div>
    </div>
  )
}
