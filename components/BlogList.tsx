'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

/* ── Company brand config ───────────────────────────── */
const COMPANY: Record<string, { color: string; bg: string; border: string }> = {
  Microsoft: { color: '#0078D4', bg: 'rgba(0,120,212,0.06)',  border: 'rgba(0,120,212,0.2)' },
  Amazon:    { color: '#E07B00', bg: 'rgba(224,123,0,0.06)',  border: 'rgba(224,123,0,0.2)' },
  Spotify:   { color: '#1DB954', bg: 'rgba(29,185,84,0.06)',  border: 'rgba(29,185,84,0.2)' },
}

function MsLogo() {
  return (
    <span className="grid grid-cols-2 gap-[2px] w-3 h-3 flex-shrink-0 inline-grid">
      <span style={{ backgroundColor: '#F25022', borderRadius: 1 }} />
      <span style={{ backgroundColor: '#7FBA00', borderRadius: 1 }} />
      <span style={{ backgroundColor: '#00A4EF', borderRadius: 1 }} />
      <span style={{ backgroundColor: '#FFB900', borderRadius: 1 }} />
    </span>
  )
}

/* ── Main component ─────────────────────────────────── */
export default function BlogList({ posts, tags }: { posts: PostMeta[]; tags: string[] }) {
  const [activeTopic,   setActiveTopic]   = useState<string | null>(null)
  const [activeCompany, setActiveCompany] = useState<string | null>(null)

  const companies = Array.from(new Set(posts.map(p => p.company).filter(Boolean))) as string[]

  const filtered = posts.filter(p => {
    if (activeTopic   && !p.tags.includes(activeTopic))    return false
    if (activeCompany && p.company !== activeCompany)      return false
    return true
  })

  return (
    <div>
      {/* ── Filters ── */}
      <div className="flex items-center gap-2 flex-wrap mb-6">

        {/* All companies pill */}
        <button
          onClick={() => setActiveCompany(null)}
          className="text-sm font-medium rounded-full px-4 py-1.5 transition-all duration-150 cursor-pointer"
          style={{
            backgroundColor: activeCompany === null ? '#0A0A0A' : '#F0F0F3',
            color:            activeCompany === null ? '#fff'    : '#6B6B6B',
          }}
        >
          All companies
        </button>

        {/* Company pills */}
        {companies.map(co => {
          const cfg = COMPANY[co]
          const isActive = activeCompany === co
          return (
            <button
              key={co}
              onClick={() => setActiveCompany(isActive ? null : co)}
              className="inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-4 py-1.5 transition-all duration-150 cursor-pointer"
              style={{
                backgroundColor: isActive ? cfg?.color ?? '#0A0A0A' : '#F0F0F3',
                color:            isActive ? '#fff' : '#6B6B6B',
              }}
            >
              {co === 'Microsoft' && <MsLogo />}
              {co}
            </button>
          )
        })}

        {/* Divider */}
        <div style={{ width: 1, height: 20, backgroundColor: '#E4E4E8', margin: '0 2px' }} />

        {/* All topics pill */}
        <button
          onClick={() => setActiveTopic(null)}
          className="text-sm font-medium rounded-full px-4 py-1.5 transition-all duration-150 cursor-pointer"
          style={{
            backgroundColor: activeTopic === null ? '#0A0A0A' : '#F0F0F3',
            color:            activeTopic === null ? '#fff'    : '#6B6B6B',
          }}
        >
          All topics
        </button>

        {/* Topic pills */}
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTopic(activeTopic === tag ? null : tag)}
            className="text-sm font-medium rounded-full px-4 py-1.5 transition-all duration-150 cursor-pointer"
            style={{
              backgroundColor: activeTopic === tag ? '#0A0A0A' : '#F0F0F3',
              color:            activeTopic === tag ? '#fff'    : '#6B6B6B',
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ── Post grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-[#ABABAB]">No posts match those filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(post => {
            const co  = post.company ? COMPANY[post.company] : null
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-3xl p-6 no-underline transition-all duration-200"
                style={{
                  backgroundColor: co ? co.bg : '#F7F7F9',
                  border: `1px solid ${co ? co.border : 'transparent'}`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = co ? co.border : '#E4E4E8'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = co ? co.border : 'transparent'
                }}
              >
                <p className="text-xs text-[#ABABAB] mb-2">
                  {formatDate(post.date)} · {post.readTime}
                </p>
                <h2 className="text-lg font-semibold text-[#0A0A0A] leading-snug mb-2 group-hover:text-[#3A3A3A] transition-colors duration-150">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4 line-clamp-1">
                    {post.description}
                  </p>
                )}
                <hr className="border-t mb-3" style={{ borderColor: co ? co.border : '#E4E4E8' }} />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    {post.company && co && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1"
                        style={{ backgroundColor: co.color, color: '#fff' }}
                      >
                        {post.company === 'Microsoft' && <MsLogo />}
                        {post.company}
                      </span>
                    )}
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs text-[#6B6B6B] bg-[#EDEDED] rounded-full px-2.5 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke={co ? co.color : '#ABABAB'}
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className="flex-shrink-0"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}
