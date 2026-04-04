'use client'

import { useState, useCallback } from 'react'

// ── Photo library ─────────────────────────────────────────────────────────────
// Place photos in /public/gallery/ and add entries below.
// The first entry is always shown first.
//
const PHOTOS: Array<{ src: string; caption?: string }> = [
  { src: '/gallery/photo1.jpg' },
  { src: '/gallery/photo2.JPG' },
  { src: '/gallery/photo3.JPG' },
  { src: '/gallery/photo4.JPG' },
  { src: '/gallery/photo5.JPG' },
]
// ─────────────────────────────────────────────────────────────────────────────

const MAX_DOTS = 7

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
  const [idx, setIdx]         = useState(0)
  const [flashKey, setFlashKey] = useState(0)   // increment to retrigger flash
  const [focusKey, setFocusKey] = useState(0)   // increment to retrigger reticle

  const triggerEffects = useCallback(() => {
    setFlashKey(k => k + 1)
    setFocusKey(k => k + 1)
  }, [])

  const navigate = useCallback((newIdx: number) => {
    setIdx(newIdx)
    triggerEffects()
  }, [triggerEffects])

  const prev = useCallback(() => {
    setIdx(i => (i - 1 + PHOTOS.length) % PHOTOS.length)
    triggerEffects()
  }, [triggerEffects])

  const next = useCallback(() => {
    setIdx(i => (i + 1) % PHOTOS.length)
    triggerEffects()
  }, [triggerEffects])

  const isEmpty = PHOTOS.length === 0
  const useDots = PHOTOS.length > 1 && PHOTOS.length <= MAX_DOTS

  return (
    <div className="bg-[#1a1a1a] rounded-3xl aspect-square relative overflow-hidden">

      <style>{`
        @keyframes gallery-fade   { from { opacity: 0.4 } to { opacity: 1 } }
        @keyframes shutter-flash  { 0% { opacity: 0 } 12% { opacity: 0.72 } 100% { opacity: 0 } }
        @keyframes reticle-in     { 0% { opacity: 0; transform: scale(1.12) } 25% { opacity: 1 } 70% { opacity: 1 } 100% { opacity: 0; transform: scale(1) } }
      `}</style>

      {/* ── Photo ── */}
      {!isEmpty && (
        <img
          key={PHOTOS[idx].src}
          src={PHOTOS[idx].src}
          alt={PHOTOS[idx].caption ?? `Photo ${idx + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ animation: 'gallery-fade 0.2s ease' }}
        />
      )}

      {/* ── Film grain ── */}
      {!isEmpty && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px 180px',
            opacity: 0.09,
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* ── Gradient scrim ── */}
      {!isEmpty && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)' }}
        />
      )}

      {/* ── Shutter flash ── */}
      {flashKey > 0 && (
        <div
          key={flashKey}
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: 'white', animation: 'shutter-flash 380ms ease-out forwards' }}
        />
      )}

      {/* ── Focus reticle ── */}
      {focusKey > 0 && (
        <div
          key={focusKey}
          className="absolute inset-0 pointer-events-none"
          style={{ animation: 'reticle-in 600ms ease-out forwards' }}
        >
          {/* corners */}
          {(['tl','tr','bl','br'] as const).map(corner => (
            <div
              key={corner}
              className="absolute"
              style={{
                width: 18, height: 18,
                top:    corner.startsWith('t') ? 14 : undefined,
                bottom: corner.startsWith('b') ? 14 : undefined,
                left:   corner.endsWith('l')   ? 14 : undefined,
                right:  corner.endsWith('r')   ? 14 : undefined,
                borderTop:    corner.startsWith('t') ? '1.5px solid rgba(255,255,255,0.85)' : undefined,
                borderBottom: corner.startsWith('b') ? '1.5px solid rgba(255,255,255,0.85)' : undefined,
                borderLeft:   corner.endsWith('l')   ? '1.5px solid rgba(255,255,255,0.85)' : undefined,
                borderRight:  corner.endsWith('r')   ? '1.5px solid rgba(255,255,255,0.85)' : undefined,
              }}
            />
          ))}
          {/* centre crosshair dot */}
          <div
            className="absolute"
            style={{
              width: 4, height: 4,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.6)',
            }}
          />
        </div>
      )}

      {/* ── Top bar ── */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
            stroke={isEmpty ? '#ABABAB' : 'rgba(255,255,255,0.5)'}
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <p className="text-[9px] font-semibold uppercase tracking-widest"
            style={{ color: isEmpty ? '#ABABAB' : 'rgba(255,255,255,0.5)' }}>
            Gallery
          </p>
        </div>
        {!isEmpty && PHOTOS.length > 1 && !useDots ? (
          <span className="text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {idx + 1} / {PHOTOS.length}
          </span>
        ) : null}
      </div>

      {/* ── Bottom controls ── */}
      {!isEmpty && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {PHOTOS[idx].caption && (
            <p className="text-[11px] mb-2.5 truncate" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {PHOTOS[idx].caption}
            </p>
          )}

          <div className="flex items-center justify-between">
            {useDots ? (
              <div className="flex items-center gap-1">
                {PHOTOS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(i)}
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
