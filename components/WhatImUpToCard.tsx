'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import type { TimelineEntry } from '@/lib/types/content'

interface Ripple {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

let uid = 0

interface WhatImUpToCardProps {
  entry: TimelineEntry
}

export default function WhatImUpToCard({ entry }: WhatImUpToCardProps) {
  const [pos, setPos]         = useState({ x: 82, y: 14 })
  const [ripples, setRipples] = useState<Ripple[]>([])
  const cardRef               = useRef<HTMLDivElement>(null)
  const lastSpawnAt           = useRef(0)

  const spawnRipples = useCallback((x: number, y: number) => {
    const now = Date.now()
    if (now - lastSpawnAt.current < 130) return
    lastSpawnAt.current = now

    const pairs: Array<{ size: number; duration: number; delay: number }> = [
      { size: 220, duration: 1000, delay: 0   },
      { size: 340, duration: 1300, delay: 120 },
    ]

    const newRipples: Ripple[] = pairs.map(p => ({ id: uid++, x, y, ...p }))
    setRipples(prev => [...prev, ...newRipples])

    const maxLifetime = Math.max(...pairs.map(p => p.duration + p.delay)) + 50
    setTimeout(() => {
      const ids = new Set(newRipples.map(r => r.id))
      setRipples(prev => prev.filter(r => !ids.has(r.id)))
    }, maxLifetime)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width)  * 100
    const y = ((e.clientY - rect.top)  / rect.height) * 100
    setPos({ x, y })
    spawnRipples(x, y)
  }, [spawnRipples])

  const bg = `
    radial-gradient(420px circle at ${pos.x}% ${pos.y}%, rgba(187,247,208,0.2) 0%, rgba(110,231,183,0.09) 40%, transparent 65%),
    radial-gradient(ellipse 65% 45% at 92% 8%,  rgba(167,243,208,0.26) 0%, transparent 100%),
    radial-gradient(ellipse 35% 25% at 5%  80%, rgba(2,44,34,0.52)     0%, transparent 100%),
    linear-gradient(150deg, #022c22 0%, #064e3b 35%, #065f46 65%, #047857 100%)
  `

  return (
    <div
      ref={cardRef}
      className="col-span-2 rounded-3xl p-5 flex flex-col gap-4 cursor-default overflow-hidden relative"
      style={{
        background: bg,
        transition: 'background 0.1s ease',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 32px rgba(2,44,34,0.35)',
      }}
      onMouseMove={handleMouseMove}
    >
      {/* ── Ripple rings ─────────────────────────────────── */}
      {ripples.map(r => (
        <span
          key={r.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left:   `${r.x}%`,
            top:    `${r.y}%`,
            width:  `${r.size}px`,
            height: `${r.size}px`,
            border: '1px solid rgba(167,243,208,0.55)',
            animation: `ripple-out ${r.duration}ms ${r.delay}ms cubic-bezier(0.2,0.6,0.4,1) both`,
          }}
        />
      ))}

      {/* ── Header ───────────────────────────────────────── */}
      <div className="relative z-10">
        <h2 className="text-2xl font-semibold text-white">What I&apos;m up to</h2>
      </div>

      <hr className="relative z-10" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* ── Role ─────────────────────────────────────────── */}
      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <p className="text-xl font-semibold text-white leading-tight">{entry.role}</p>
          {entry.href && (
          <Link
            href={entry.href}
            onClick={e => e.stopPropagation()}
            className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 transition-all duration-150"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.22)'
              ;(e.currentTarget as HTMLElement).style.color = '#fff'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.12)'
              ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          {entry.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={entry.logoUrl} alt={entry.company} className="w-5 h-5 object-contain flex-shrink-0" />
          ) : (
            <div className="grid grid-cols-2 gap-[2px] flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: '#F25022' }} />
              <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: '#7FBA00' }} />
              <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: '#00A4EF' }} />
              <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: '#FFB900' }} />
            </div>
          )}
          <div className="flex items-center gap-2">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {entry.company} · {entry.period}
            </p>
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold rounded-full px-2.5 py-1"
              style={{ backgroundColor: 'rgba(167,243,208,0.15)', color: '#a7f3d0' }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: '#34d399' }} />
              Now
            </span>
          </div>
        </div>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
          {entry.description}
        </p>
      </div>

      {/* ── Meta row ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 pt-1 relative z-10">
        {entry.learning && (
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(167,243,208,0.45)' }}>
            Learning
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {entry.learning}
          </p>
        </div>
        )}
        {entry.location && (
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(167,243,208,0.45)' }}>
            Location
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {entry.location}
          </p>
        </div>
        )}
      </div>
    </div>
  )
}
