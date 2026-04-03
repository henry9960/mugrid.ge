'use client'

import { useState, useRef } from 'react'

export default function WhatImUpToCard() {
  const [hovered, setHovered] = useState(false)
  const [pos, setPos] = useState({ x: 80, y: 15 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  // Resting — dappled light through a forest canopy
  const restingBg = `
    radial-gradient(ellipse 65% 45% at 92% 8%,  rgba(167,243,208,0.32) 0%, transparent 100%),
    radial-gradient(ellipse 40% 30% at 68% 2%,  rgba(110,231,183,0.18) 0%, transparent 100%),
    radial-gradient(ellipse 35% 25% at 50% 95%, rgba(4,120,87,0.55)    0%, transparent 100%),
    radial-gradient(ellipse 25% 20% at 5%  80%,  rgba(2,44,34,0.6)      0%, transparent 100%),
    linear-gradient(150deg, #022c22 0%, #064e3b 35%, #065f46 65%, #047857 100%)
  `

  // Hover — warm sunlight beam tracking the cursor
  const hoverBg = `
    radial-gradient(380px circle at ${pos.x}% ${pos.y}%, rgba(187,247,208,0.22) 0%, rgba(110,231,183,0.1) 38%, transparent 65%),
    radial-gradient(ellipse 65% 45% at 92% 8%,  rgba(167,243,208,0.24) 0%, transparent 100%),
    radial-gradient(ellipse 35% 25% at 5%  80%,  rgba(2,44,34,0.5)      0%, transparent 100%),
    linear-gradient(150deg, #022c22 0%, #064e3b 35%, #065f46 65%, #047857 100%)
  `

  return (
    <div
      ref={cardRef}
      className="col-span-2 rounded-3xl p-5 flex flex-col gap-4 cursor-default overflow-hidden"
      style={{
        background: hovered ? hoverBg : restingBg,
        transition: hovered ? 'background 0.1s ease' : 'background 0.5s ease',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 32px rgba(2,44,34,0.35)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">What I&apos;m up to</h2>
        <span
          className="inline-flex items-center gap-1.5 text-[10px] font-semibold rounded-full px-2.5 py-1"
          style={{ backgroundColor: 'rgba(167,243,208,0.15)', color: '#a7f3d0' }}
        >
          <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: '#34d399' }} />
          Now
        </span>
      </div>

      <hr style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* Role */}
      <div>
        <p className="text-xl font-semibold text-white leading-tight">
          Product Manager Intern
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="grid grid-cols-2 gap-[2px] flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: '#F25022' }} />
            <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: '#7FBA00' }} />
            <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: '#00A4EF' }} />
            <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: '#FFB900' }} />
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Microsoft · Summer 2026
          </p>
        </div>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
          WIP — add a one-liner about what you&apos;re working on here.
        </p>
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-2 pt-1">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(167,243,208,0.45)' }}>
            Learning
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Vibecoding and using Claude!
          </p>
        </div>
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(167,243,208,0.45)' }}>
            Location
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
            London, UK
          </p>
        </div>
      </div>
    </div>
  )
}
