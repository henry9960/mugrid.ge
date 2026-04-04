'use client'

import { useState } from 'react'
import ExternalLinkButton from '@/components/ExternalLinkButton'

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

  const hoverStyle: React.CSSProperties =
    typeof hoverBg === 'string' ? { backgroundColor: hoverBg } : hoverBg

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-[#F7F7F9] rounded-3xl p-4 md:p-6 flex flex-col justify-between no-underline aspect-square ${className}`}
      style={{ transition: 'background 0.18s ease-out', ...(hovered ? hoverStyle : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2
        className="text-lg md:text-2xl font-semibold"
        style={{ color: hovered ? '#ffffff' : '#0A0A0A', transition: 'color 0.18s ease-out' }}
      >
        {platform}
      </h2>
      <div>
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
function EmailCard({ className = '' }: { className?: string }) {
  const [copied, setCopied] = useState(false)
  const email = 'harry@mugrid.ge'

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      className={`rounded-3xl p-4 md:p-6 flex flex-col justify-between aspect-square ${className}`}
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* Top */}
      <div>
        <h2 className="text-lg md:text-2xl font-semibold text-white">Email</h2>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {email}
        </p>
      </div>

      {/* Bottom CTAs */}
      <div className="flex md:flex-col gap-2">
        <a
          href={`mailto:${email}`}
          className="flex-1 flex items-center justify-center md:justify-between rounded-2xl px-3 py-2 md:px-4 md:py-3 no-underline group"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', transition: 'background 0.15s ease-out' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
        >
          <span className="hidden md:inline text-sm font-medium text-white">Open mail app</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>

        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center md:justify-between rounded-2xl px-3 py-2 md:px-4 md:py-3"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', transition: 'background 0.15s ease-out' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
        >
          <span className="hidden md:inline text-sm font-medium text-white">
            {copied ? 'Copied!' : 'Copy address'}
          </span>
          <span className="text-white opacity-70 text-base">{copied ? '✓' : '⎘'}</span>
        </button>
      </div>
    </div>
  )
}

/* ── GitHub coming soon (square) ─────────────────────────── */
function GitHubCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-[#F7F7F9] rounded-3xl p-4 md:p-6 flex flex-col justify-between aspect-square ${className}`}
      style={{ opacity: 0.4, pointerEvents: 'none', userSelect: 'none' }}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-lg md:text-2xl font-semibold text-[#0A0A0A]">GitHub</h2>
        <span className="text-[10px] font-semibold text-[#8A8A8A] bg-[#EDEDED] rounded-full px-2.5 py-1">
          Soon
        </span>
      </div>
      <div>
        <hr className="border-t border-[#E4E4E8] mb-3" />
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6B6B6B]">@henry9960</p>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      </div>
    </div>
  )
}

/* ── Section ──────────────────────────────────────────────── */
export default function ContactSection() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <PlatformCard
        className="col-span-6 md:col-span-3"
        platform="LinkedIn"
        handle="/in/harrymugridge"
        href="https://linkedin.com/in/harrymugridge"
        hoverBg="#0A66C2"
      />
      <PlatformCard
        className="col-span-6 md:col-span-3"
        platform="Instagram"
        handle="@hyhb"
        href="https://instagram.com/hyhb"
        hoverBg={{
          background:
            'linear-gradient(135deg, #833AB4 0%, #C13584 35%, #E1306C 55%, #FD1D1D 78%, #FCB045 100%)',
        }}
      />
      <EmailCard className="col-span-6 md:col-span-3" />
      <GitHubCard className="col-span-6 md:col-span-3" />
    </div>
  )
}
