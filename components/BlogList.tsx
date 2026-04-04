'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

export default function BlogList({ posts, tags }: { posts: PostMeta[]; tags: string[] }) {
  const [active, setActive] = useState<string | null>(null)

  const filtered = active ? posts.filter(p => p.tags.includes(active)) : posts

  return (
    <div>
      {/* ── Tag filter ── */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        <button
          onClick={() => setActive(null)}
          className="text-xs font-medium rounded-full px-3.5 py-1.5 transition-all duration-150 cursor-pointer"
          style={{
            backgroundColor: active === null ? '#0A0A0A' : '#F0F0F3',
            color:            active === null ? '#ffffff'  : '#6B6B6B',
          }}
        >
          All
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setActive(active === tag ? null : tag)}
            className="text-xs font-medium rounded-full px-3.5 py-1.5 transition-all duration-150 cursor-pointer"
            style={{
              backgroundColor: active === tag ? '#0A0A0A' : '#F0F0F3',
              color:            active === tag ? '#ffffff'  : '#6B6B6B',
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ── Post grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-[#ABABAB]">No posts with that tag yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-[#F7F7F9] rounded-3xl p-6 no-underline transition-all duration-200"
              style={{ border: '1px solid transparent' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
            >
              <p className="text-xs text-[#ABABAB] mb-2">
                {formatDate(post.date)} · {post.readTime}
              </p>
              <h2 className="text-lg font-semibold text-[#0A0A0A] leading-snug mb-2 group-hover:text-[#3A3A3A] transition-colors duration-150">
                {post.title}
              </h2>
              {post.description && (
                <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4 line-clamp-2">
                  {post.description}
                </p>
              )}
              <hr className="border-t border-[#E4E4E8] mb-3" />
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs text-[#6B6B6B] bg-[#EDEDED] rounded-full px-2.5 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}
