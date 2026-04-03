'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Reusable platform card ──────────────────────────── */
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
    typeof hoverBg === 'string'
      ? { backgroundColor: hoverBg }
      : hoverBg

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-[#F7F7F9] rounded-3xl p-6 flex flex-col justify-between cursor-pointer no-underline ${className}`}
      style={{
        transition: 'background 0.18s ease-out, box-shadow 0.18s ease-out',
        ...(hovered ? hoverStyle : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        <h2
          className="text-2xl font-semibold"
          style={{
            color: hovered ? '#ffffff' : '#0A0A0A',
            transition: 'color 0.18s ease-out',
          }}
        >
          {platform}
        </h2>
        <hr
          className="my-4 border-t"
          style={{
            borderColor: hovered ? 'rgba(255,255,255,0.2)' : '#E4E4E8',
            transition: 'border-color 0.18s ease-out',
          }}
        />
        <p
          className="text-sm"
          style={{
            color: hovered ? 'rgba(255,255,255,0.75)' : '#6B6B6B',
            transition: 'color 0.18s ease-out',
          }}
        >
          {handle}
        </p>
      </div>
      <p
        className="text-xs mt-4"
        style={{
          color: hovered ? 'rgba(255,255,255,0.5)' : '#ABABAB',
          transition: 'color 0.18s ease-out',
        }}
      >
        View profile →
      </p>
    </a>
  )
}

/* ── Email compose card ───────────────────────────────── */
function EmailCard({ className = '' }: { className?: string }) {
  const [composing, setComposing] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const mailtoHref = `mailto:hello@henry.design?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`

  return (
    <div className={`bg-[#F7F7F9] rounded-3xl p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-semibold text-[#0A0A0A]">Email</h2>
        {!composing && (
          <button
            onClick={() => setComposing(true)}
            className="text-xs font-medium text-[#0A0A0A] bg-[#EDEDED] rounded-full px-3 py-1.5 hover:bg-[#E4E4E8] transition-colors duration-150 flex-shrink-0"
          >
            Compose →
          </button>
        )}
      </div>

      <hr className="border-t border-[#E4E4E8] my-4" />

      <p className="text-sm text-[#6B6B6B] mb-4">hello@henry.design</p>

      <AnimatePresence>
        {composing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pb-1">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-[#ABABAB] block mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full bg-[#EDEDED] rounded-xl px-3 py-2 text-sm text-[#0A0A0A] placeholder-[#C0C0C4] outline-none focus:ring-2 focus:ring-black/10 transition-shadow"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-widest text-[#ABABAB] block mb-1.5">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message..."
                  rows={4}
                  className="w-full bg-[#EDEDED] rounded-xl px-3 py-2 text-sm text-[#0A0A0A] placeholder-[#C0C0C4] outline-none focus:ring-2 focus:ring-black/10 transition-shadow resize-none"
                />
              </div>
              <div className="flex gap-2">
                <a
                  href={mailtoHref}
                  className="flex-1 text-center text-sm font-semibold text-white bg-[#0A0A0A] rounded-xl py-2 hover:bg-[#2A2A2A] transition-colors duration-150 no-underline"
                >
                  Open in Mail →
                </a>
                <button
                  onClick={() => { setComposing(false); setSubject(''); setMessage('') }}
                  className="text-sm text-[#6B6B6B] bg-[#EDEDED] hover:bg-[#E4E4E8] rounded-xl px-4 py-2 transition-colors duration-150"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!composing && (
        <p className="text-xs text-[#ABABAB]">Usually responds within 48 hours</p>
      )}
    </div>
  )
}

/* ── GitHub coming soon card ──────────────────────────── */
function GitHubCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-[#F7F7F9] rounded-3xl p-6 ${className}`}
      style={{ opacity: 0.45, pointerEvents: 'none', userSelect: 'none' }}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-semibold text-[#0A0A0A]">GitHub</h2>
        <span className="text-[10px] font-semibold text-[#8A8A8A] bg-[#EDEDED] rounded-full px-2.5 py-1">
          Soon
        </span>
      </div>
      <hr className="border-t border-[#E4E4E8] my-4" />
      <p className="text-sm text-[#6B6B6B]">@henry</p>
      <p className="text-xs text-[#ABABAB] mt-4">View profile →</p>
    </div>
  )
}

/* ── Section ──────────────────────────────────────────── */
export default function ContactSection() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <PlatformCard
        className="col-span-12 md:col-span-3"
        platform="LinkedIn"
        handle="/in/henrydesign"
        href="https://linkedin.com/in/henrydesign"
        hoverBg="#0A66C2"
      />
      <PlatformCard
        className="col-span-12 md:col-span-3"
        platform="Instagram"
        handle="@henry.design"
        href="https://instagram.com/henry.design"
        hoverBg={{
          background:
            'linear-gradient(135deg, #833AB4 0%, #C13584 35%, #E1306C 55%, #FD1D1D 78%, #FCB045 100%)',
        }}
      />
      <EmailCard className="col-span-12 md:col-span-6" />
      <GitHubCard className="col-span-12 md:col-span-4" />
    </div>
  )
}
