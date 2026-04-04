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

/* ── Email card (square, coloured) ───────────────────────── */
function EmailCard({ email, className = '' }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const blob1WrapRef = useRef<HTMLDivElement>(null)
  const blob2WrapRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0, inside: false })
  const b1 = useRef({ x: 0, y: 0 })
  const b2 = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let raf: number
    const tick = () => {
      const { x: mx, y: my, inside } = mouse.current
      const pull = inside ? 1 : 0
      // blob1 lags a little, blob2 is snappier — feels like two different masses
      b1.current.x += (mx * 0.42 * pull - b1.current.x) * 0.05
      b1.current.y += (my * 0.42 * pull - b1.current.y) * 0.05
      b2.current.x += (mx * 0.68 * pull - b2.current.x) * 0.09
      b2.current.y += (my * 0.68 * pull - b2.current.y) * 0.09
      if (blob1WrapRef.current)
        blob1WrapRef.current.style.transform = `translate(${b1.current.x}px,${b1.current.y}px)`
      if (blob2WrapRef.current)
        blob2WrapRef.current.style.transform = `translate(${b2.current.x}px,${b2.current.y}px)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mouse.current = { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2, inside: true }
  }
  const onMouseLeave = () => { mouse.current.inside = false }

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      className={`rounded-3xl p-4 md:p-6 flex flex-col justify-between aspect-square relative overflow-hidden ${className}`}
      style={{ backgroundColor: '#041f12', cursor: 'crosshair' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* blob1 wrapper — cursor offset applied here; inner div keeps CSS animation */}
      <div ref={blob1WrapRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: '80%', height: '80%',
          borderRadius: '50%', top: '-20%', left: '-20%',
          background: 'radial-gradient(circle, rgba(4,120,87,0.85) 0%, transparent 70%)',
          filter: 'blur(18px)',
          animation: 'blob-clash-1 8s ease-in-out infinite',
        }} />
      </div>
      {/* blob2 wrapper */}
      <div ref={blob2WrapRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: '80%', height: '80%',
          borderRadius: '50%', bottom: '-20%', right: '-20%',
          background: 'radial-gradient(circle, rgba(249,168,212,0.8) 0%, transparent 65%)',
          filter: 'blur(18px)',
          animation: 'blob-clash-2 8s ease-in-out infinite',
        }} />
      </div>
      {/* scattered blob fragments — extreme burst to card edges */}
      {([
        { fx: '130px',  fy: '-120px', color: 'rgba(249,168,212,0.9)',  size: '38%', delay: 0.04 },
        { fx: '-125px', fy: '-115px', color: 'rgba(4,120,87,0.85)',    size: '34%', delay: 0.09 },
        { fx: '135px',  fy: '125px',  color: 'rgba(249,168,212,0.85)', size: '30%', delay: 0.02 },
        { fx: '-130px', fy: '120px',  color: 'rgba(4,150,87,0.8)',     size: '32%', delay: 0.11 },
        { fx: '0px',    fy: '-140px', color: 'rgba(249,168,212,0.8)',  size: '28%', delay: 0.06 },
        { fx: '0px',    fy: '138px',  color: 'rgba(4,120,87,0.8)',     size: '26%', delay: 0.07 },
        { fx: '-142px', fy: '0px',    color: 'rgba(249,168,212,0.75)', size: '24%', delay: 0.05 },
        { fx: '140px',  fy: '0px',    color: 'rgba(4,120,87,0.75)',    size: '26%', delay: 0.1  },
        { fx: '90px',   fy: '-130px', color: 'rgba(4,150,87,0.7)',     size: '22%', delay: 0.13 },
        { fx: '-95px',  fy: '125px',  color: 'rgba(249,168,212,0.7)',  size: '20%', delay: 0.03 },
        { fx: '-110px', fy: '-80px',  color: 'rgba(249,168,212,0.8)',  size: '28%', delay: 0.08 },
        { fx: '105px',  fy: '95px',   color: 'rgba(4,120,87,0.85)',    size: '24%', delay: 0.14 },
        { fx: '-60px',  fy: '-138px', color: 'rgba(4,120,87,0.75)',    size: '20%', delay: 0.06 },
        { fx: '55px',   fy: '135px',  color: 'rgba(249,168,212,0.75)', size: '22%', delay: 0.12 },
      ] as { fx: string; fy: string; color: string; size: string; delay: number }[]).map(({ fx, fy, color, size, delay }, i) => (
        <div key={i} style={{
          position: 'absolute', left: '50%', top: '50%',
          width: size, height: size, borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: 'blur(14px)',
          ['--fx' as string]: fx,
          ['--fy' as string]: fy,
          animation: `blob-scatter 8s ease-in-out ${delay}s infinite`,
          pointerEvents: 'none',
        }} />
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
