'use client'

import { useState, useCallback } from 'react'

// ── Photo library ─────────────────────────────────────────────────────────────
// Google Drive folder: https://drive.google.com/drive/folders/1SRB0MjsFS7uSgROpNIFO7bmv78_FH8ZR
//
// To add a photo from that folder:
//   1. Open the file in Drive → the URL will look like:
//      https://drive.google.com/file/d/FILE_ID/view
//   2. Make sure sharing is set to "Anyone with the link"
//   3. Add an entry below using:
//      { src: 'https://drive.google.com/uc?export=view&id=FILE_ID', caption: 'Optional' }
//
// Local files also work — place in /public/gallery/ and use '/gallery/photo.jpg'
//
const PHOTOS: Array<{ src: string; caption?: string }> = [
  { src: '/gallery/photo1.jpg' },
  { src: '/gallery/photo2.JPG' },
  { src: '/gallery/photo3.JPG' },
  { src: '/gallery/photo4.JPG' },
  { src: '/gallery/photo5.JPG' },
]
// ─────────────────────────────────────────────────────────────────────────────

const MAX_DOTS = 7   // beyond this, show "n / total" counter instead of dots

function ChevronLeft() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}
function ChevronRight() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function NavButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer"
      style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.32)')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)')}
    >
      {children}
    </button>
  )
}

export default function GalleryCard() {
  const [idx, setIdx] = useState(0)

  const prev = useCallback(() => setIdx(i => (i - 1 + PHOTOS.length) % PHOTOS.length), [])
  const next = useCallback(() => setIdx(i => (i + 1) % PHOTOS.length), [])

  const isEmpty = PHOTOS.length === 0
  const useDots = PHOTOS.length > 1 && PHOTOS.length <= MAX_DOTS

  return (
    <div className="bg-[#F7F7F9] rounded-3xl aspect-square relative overflow-hidden">

      {/* ── Photo ── */}
      {!isEmpty && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={PHOTOS[idx].src}
            src={PHOTOS[idx].src}
            alt={PHOTOS[idx].caption ?? `Photo ${idx + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ animation: 'gallery-fade 0.25s ease' }}
          />
          <style>{`@keyframes gallery-fade { from { opacity: 0.5; } to { opacity: 1; } }`}</style>
          {/* Gradient scrim */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 45%, transparent 100%)' }}
          />
        </>
      )}

      {/* ── Top bar ── */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <p
          className="text-[9px] font-semibold uppercase tracking-widest"
          style={{ color: isEmpty ? '#ABABAB' : 'rgba(255,255,255,0.5)' }}
        >
          Gallery
        </p>
        {!isEmpty && PHOTOS.length > 1 && !useDots ? (
          <span className="text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {idx + 1} / {PHOTOS.length}
          </span>
        ) : null}
      </div>

      {/* ── Empty state — intentionally blank ── */}

      {/* ── Bottom controls ── */}
      {!isEmpty && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {PHOTOS[idx].caption && (
            <p className="text-[11px] mb-2.5 truncate" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {PHOTOS[idx].caption}
            </p>
          )}

          <div className="flex items-center justify-between">
            {/* Dots indicator */}
            {useDots ? (
              <div className="flex items-center gap-1">
                {PHOTOS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className="rounded-full transition-all duration-200 cursor-pointer"
                    style={{
                      width:           i === idx ? '14px' : '5px',
                      height:          '5px',
                      backgroundColor: i === idx ? '#ffffff' : 'rgba(255,255,255,0.35)',
                    }}
                  />
                ))}
              </div>
            ) : (
              <div />
            )}

            {/* Prev / Next arrows */}
            {PHOTOS.length > 1 && (
              <div className="flex items-center gap-1.5">
                <NavButton onClick={prev}><ChevronLeft /></NavButton>
                <NavButton onClick={next}><ChevronRight /></NavButton>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
