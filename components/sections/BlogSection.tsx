import Link from 'next/link'
import { getAllPosts, formatPostDate } from '@/lib/posts'
import BlogCard from '@/components/BlogCard'

/* ── Company brand config (mirrors BlogList.tsx) ── */
const COMPANY: Record<string, { color: string; bg: string; border: string }> = {
  Microsoft: { color: '#0078D4', bg: 'rgba(0,120,212,0.06)',  border: 'rgba(0,120,212,0.2)' },
  Amazon:    { color: '#E07B00', bg: 'rgba(224,123,0,0.06)',  border: 'rgba(224,123,0,0.2)' },
  Spotify:   { color: '#1DB954', bg: 'rgba(29,185,84,0.06)',  border: 'rgba(29,185,84,0.2)' },
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function getCompanyCfg(company?: string, companyColor?: string) {
  if (!company) return null
  if (COMPANY[company]) return COMPANY[company]
  if (companyColor) return {
    color:  companyColor,
    bg:     hexToRgba(companyColor, 0.06),
    border: hexToRgba(companyColor, 0.2),
  }
  return null
}

export default function BlogSection() {
  const recent = getAllPosts().slice(0, 3)

  return (
    <div className="relative">
      {/* ── Recent posts grid ── */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        {recent.map(post => {
          const co = getCompanyCfg(post.company, post.companyColor)
          return (
            <BlogCard
              key={post.slug}
              href={`/blog/${post.slug}`}
              date={formatPostDate(post.date)}
              readTime={post.readTime}
              title={post.title}
              description={post.description}
              tags={post.tags}
              co={co}
            />
          )
        })}

        {/* Placeholder cards if fewer than 3 posts */}
        {Array.from({ length: Math.max(0, 3 - recent.length) }).map((_, i) => (
          <div key={i} className="col-span-12 md:col-span-4 bg-[#F7F7F9] rounded-3xl p-6 opacity-40">
            <div className="h-3 w-24 bg-[#E4E4E8] rounded mb-2" />
            <div className="h-5 w-full bg-[#E4E4E8] rounded mb-2" />
            <div className="h-5 w-3/4 bg-[#E4E4E8] rounded mb-4" />
            <hr className="border-t border-[#E4E4E8] mb-4" />
            <div className="h-3 w-16 bg-[#E4E4E8] rounded" />
          </div>
        ))}
      </div>

      {/* ── View all link ── */}
      <div className="flex justify-end">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors duration-150"
        >
          View all posts
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
