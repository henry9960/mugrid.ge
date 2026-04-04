'use client'

import { useState, useEffect, useRef } from 'react'
import type { ContactContent } from '@/lib/types/content'

/* ── Platform card (square) ───────────────────────────── */
function PlatformCard({
  platform,
  handle,
  href,
  hoverBg,
  className = '',
}: {
  platform: string
  handle: string
  href: string
  hoverBg: string | Record<string, string>
  className?: string
}) {
  const [hovered, setHovered] = useState(false)
  const isGradient = typeof hoverBg !== 'string'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`rounded-3xl p-4 md:p-6 flex flex-col justify-between no-underline aspect-square relative overflow-hidden ${className}`}
      style={{
        backgroundColor: '#F7F7F9',
        ...(!isGradient && hovered ? { backgroundColor: hoverBg as string } : {}),
        transition: 'background-color 0.18s ease-out',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* gradient overlay for non-solid hover colours (e.g. Instagram) */}
      {isGradient && (
        <div
          style={{
            position: 'absolute', inset: 0,
            ...(hoverBg as Record<string, string>),
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.18s ease-out',
            pointerEvents: 'none',
          }}
        />
      )}
      <h2
        className="text-lg md:text-2xl font-semibold relative"
        style={{ color: hovered ? '#ffffff' : '#0A0A0A', transition: 'color 0.18s ease-out' }}
      >
        {platform}
      </h2>
      <div className="relative">
        <hr
          className="border-t mb-3"
          style={{ borderColor: hovered ? 'rgba(255,255,255,0.2)' : '#E4E4E8', transition: 'border-color 0.18s ease-out' }}
        />
        <div className="flex items-center justify-between">
          <p
            className="text-xs md:text-sm truncate mr-2"
            style={{ color: hovered ? 'rgba(255,255,255,0.75)' : '#6B6B6B', transition: 'color 0.18s ease-out' }}
          >
            {handle}
          </p>
          <svg
            width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke={hovered ? 'rgba(255,255,255,0.5)' : '#ABABAB'}
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0, transition: 'stroke 0.18s ease-out' }}
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      </div>
    </a>
  )
}

/* ── Particle helpers ── */
const SCATTER_COLORS: [string, number][] = [
  ['rgba(249,168,212,', 0.88],
  ['rgba(4,120,87,',    0.92],
  ['rgba(20,184,166,',  0.82],
  ['rgba(251,191,36,',  0.80],
]
type Particle = {
  left: number; top: number; sizePx: number; colorBase: string; opacity: number;
  animDelay: number; animDur: number; driftSpeed: number;
  driftPhaseX: number; driftPhaseY: number; driftRadius: number;
}
function generateParticles(): Particle[] {
  return Array.from({ length: 22 }, (_, i) => {
    const [colorBase, op] = SCATTER_COLORS[i % SCATTER_COLORS.length]
    return {
      left:        8 + Math.random() * 84,
      top:         8 + Math.random() * 84,
      sizePx:      14 + Math.random() * 26,
      colorBase,
      opacity:     +(op - 0.08 + Math.random() * 0.16).toFixed(2),
      animDelay:   +(Math.random() * 4).toFixed(2),
      animDur:     +(3 + Math.random() * 3).toFixed(1),
      driftSpeed:  0.25 + Math.random() * 0.5,
      driftPhaseX: Math.random() * Math.PI * 2,
      driftPhaseY: Math.random() * Math.PI * 2,
      driftRadius: 10 + Math.random() * 18,
    }
  })
}

/* ── Email card (square, coloured) ───────────────────────── */
function EmailCard({ email, className = '' }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const blob1WrapRef = useRef<HTMLDivElement>(null)
  const blob2WrapRef = useRef<HTMLDivElement>(null)
  const blob3WrapRef = useRef<HTMLDivElement>(null)
  const blob4WrapRef = useRef<HTMLDivElement>(null)
  const particlesRef     = useRef<Particle[]>([])
  const particleDomRefs  = useRef<(HTMLDivElement | null)[]>([])
  const particleOffsets  = useRef<{ ox: number; oy: number }[]>([])
  const mouse = useRef({ x: 0, y: 0 })
  const b1 = useRef({ x: 0, y: 0 })
  const b2 = useRef({ x: 0, y: 0 })
  const b3 = useRef({ x: 0, y: 0 })
  const b4 = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let raf: number
    const tick = () => {
      const { x: mx, y: my } = mouse.current
      // 4 blobs at different speeds & offsets — all chase last known cursor position
      b1.current.x += (mx * 0.50 - b1.current.x) * 0.04
      b1.current.y += (my * 0.50 - b1.current.y) * 0.04
      b2.current.x += (mx * 0.78 - b2.current.x) * 0.08
      b2.current.y += (my * 0.78 - b2.current.y) * 0.08
      b3.current.x += (mx * 1.05 - b3.current.x) * 0.13
      b3.current.y += (my * 1.05 - b3.current.y) * 0.13
      b4.current.x += (mx * 1.25 - b4.current.x) * 0.20
      b4.current.y += (my * 1.25 - b4.current.y) * 0.20
      if (blob1WrapRef.current)
        blob1WrapRef.current.style.transform = `translate(${b1.current.x}px,${b1.current.y}px)`
      if (blob2WrapRef.current)
        blob2WrapRef.current.style.transform = `translate(${b2.current.x}px,${b2.current.y}px)`
      if (blob3WrapRef.current)
        blob3WrapRef.current.style.transform = `translate(${b3.current.x}px,${b3.current.y}px)`
      if (blob4WrapRef.current)
        blob4WrapRef.current.style.transform = `translate(${b4.current.x}px,${b4.current.y}px)`
      // Particle cursor repulsion
      const cardW = cardRef.current?.offsetWidth ?? 200
      const cardH = cardRef.current?.offsetHeight ?? 200
      particleOffsets.current.forEach((offs, i) => {
        const el = particleDomRefs.current[i]
        if (!el) return
        const p = particlesRef.current[i]
        if (!p) return
        const px = (p.left / 100) * cardW - cardW / 2
        const py = (p.top / 100) * cardH - cardH / 2
        const dx = mx - px
        const dy = my - py
        const dist = Math.sqrt(dx * dx + dy * dy)
        let targetOx = 0, targetOy = 0
        const REPEL_R = 75, MAX_PUSH = 28
        if (dist < REPEL_R && dist > 0.5) {
          const force = (1 - dist / REPEL_R) * MAX_PUSH
          targetOx = -(dx / dist) * force
          targetOy = -(dy / dist) * force
        }
        offs.ox += (targetOx - offs.ox) * 0.14
        offs.oy += (targetOy - offs.oy) * 0.14
        const t = Date.now() / 1000
        const driftX = Math.sin(t * p.driftSpeed + p.driftPhaseX) * p.driftRadius
        const driftY = Math.cos(t * p.driftSpeed * 0.7 + p.driftPhaseY) * p.driftRadius
        el.style.transform = `translate(${(offs.ox + driftX).toFixed(1)}px,${(offs.oy + driftY).toFixed(1)}px)`
      })
      raf = requestAnimationFrame(tick)
    }
    // Generate particles client-only to avoid SSR hydration mismatch
    particlesRef.current = generateParticles()
    particleOffsets.current = particlesRef.current.map(() => ({ ox: 0, oy: 0 }))
    setMounted(true)
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mouse.current = { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 }
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      ref={cardRef}
      className={`rounded-3xl p-4 md:p-6 flex flex-col justify-between aspect-square relative overflow-hidden ${className}`}
      style={{ backgroundColor: '#041f12' }}
      onMouseMove={onMouseMove}
    >
      {/* blob1 — emerald, heavy/slow */}
      <div ref={blob1WrapRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: '90%', height: '90%',
          borderRadius: '50%', top: '-25%', left: '-25%',
          background: 'radial-gradient(circle, rgba(4,120,87,0.35) 0%, transparent 70%)',
          filter: 'blur(20px)',
          animation: 'blob-clash-1 9s ease-in-out infinite',
        }} />
      </div>
      {/* blob2 — pink, medium */}
      <div ref={blob2WrapRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: '85%', height: '85%',
          borderRadius: '50%', bottom: '-25%', right: '-25%',
          background: 'radial-gradient(circle, rgba(249,168,212,0.3) 0%, transparent 65%)',
          filter: 'blur(18px)',
          animation: 'blob-clash-2 7s ease-in-out infinite',
        }} />
      </div>
      {/* blob3 — cyan, fast */}
      <div ref={blob3WrapRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: '70%', height: '70%',
          borderRadius: '50%', top: '10%', right: '-15%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.28) 0%, transparent 70%)',
          filter: 'blur(16px)',
          animation: 'blob-clash-3 6s ease-in-out 1s infinite',
        }} />
      </div>
      {/* blob4 — gold, snappy */}
      <div ref={blob4WrapRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: '60%', height: '60%',
          borderRadius: '50%', bottom: '5%', left: '-10%',
          background: 'radial-gradient(circle, rgba(251,191,36,0.28) 0%, transparent 70%)',
          filter: 'blur(14px)',
          animation: 'blob-clash-4 5s ease-in-out 0.5s infinite',
        }} />
      </div>
      {/* scattered particles — random positions, cursor-repelled via JS (client-only to avoid hydration mismatch) */}
      {mounted && particlesRef.current.map((p, i) => (
        <div
          key={i}
          ref={(el: HTMLDivElement | null) => { particleDomRefs.current[i] = el }}
          style={{ position: 'absolute', left: `${p.left}%`, top: `${p.top}%`, pointerEvents: 'none' }}
        >
          <div style={{
            width: `${p.sizePx}px`,
            height: `${p.sizePx}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${p.colorBase}${p.opacity}) 0%, transparent 70%)`,
            filter: 'blur(9px)',
            animation: `particle-pulse ${p.animDur}s ease-in-out ${p.animDelay}s infinite`,
          }} />
        </div>
      ))}

      <div style={{ position: 'relative' }}>
        <h2 className="text-lg md:text-2xl font-semibold text-white">Email</h2>
        <p className="text-xs md:text-sm mt-1 font-mono tracking-tight" style={{ color: 'rgba(255,255,255,0.55)' }}>
          {email}
        </p>
      </div>

      <div className="flex md:flex-col gap-2 relative">
        <a
          href={`mailto:${email}`}
          className="flex-1 flex items-center justify-center md:justify-between rounded-2xl px-3 py-2 md:px-4 md:py-3 no-underline"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.1)', transition: 'background 0.15s ease-out' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
        >
          <span className="hidden md:inline text-sm font-medium text-white">Open mail app</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>

        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center md:justify-between rounded-2xl px-3 py-2 md:px-4 md:py-3"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.1)', transition: 'background 0.15s ease-out' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
        >
          <span className="hidden md:inline text-sm font-medium text-white">
            {copied ? 'Copied!' : 'Copy address'}
          </span>
          <span className="text-white text-base" style={{ opacity: 0.8 }}>{copied ? '✓' : '⎘'}</span>
        </button>
      </div>
    </div>
  )
}

/* ── Disabled social card ─────────────────────────────── */
function DisabledCard({ platform, handle, className = '' }: { platform: string; handle: string; className?: string }) {
  return (
    <div
      className={`bg-[#F7F7F9] rounded-3xl p-4 md:p-6 flex flex-col justify-between aspect-square ${className}`}
      style={{ opacity: 0.4, pointerEvents: 'none', userSelect: 'none' }}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-lg md:text-2xl font-semibold text-[#0A0A0A]">{platform}</h2>
        <span className="text-[10px] font-semibold text-[#8A8A8A] bg-[#EDEDED] rounded-full px-2.5 py-1">
          Soon
        </span>
      </div>
      <div>
        <hr className="border-t border-[#E4E4E8] mb-3" />
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6B6B6B]">{handle}</p>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      </div>
    </div>
  )
}

/* ── Instagram hover style ───────────────────────────────── */
const instagramHoverBg = {
  background:
    'linear-gradient(135deg, #833AB4 0%, #C13584 35%, #E1306C 55%, #FD1D1D 78%, #FCB045 100%)',
}

const platformHoverColors: Record<string, string | Record<string, string>> = {
  LinkedIn: '#0A66C2',
  Instagram: instagramHoverBg,
}

/* ── Section ──────────────────────────────────────────────── */
interface ContactSectionProps {
  data: ContactContent
}

export default function ContactSection({ data }: ContactSectionProps) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {data.socials.map(social => (
        social.enabled ? (
          <PlatformCard
            key={social.id}
            className="col-span-6 md:col-span-3"
            platform={social.platform}
            handle={social.handle}
            href={social.url}
            hoverBg={platformHoverColors[social.platform] ?? '#0A0A0A'}
          />
        ) : (
          <DisabledCard
            key={social.id}
            className="col-span-6 md:col-span-3"
            platform={social.platform}
            handle={social.handle}
          />
        )
      ))}
      <EmailCard email={data.email} className="col-span-6 md:col-span-3" />
    </div>
  )
}
