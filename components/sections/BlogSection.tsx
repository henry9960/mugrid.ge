import Link from 'next/link'
import { getAllPosts, formatPostDate } from '@/lib/posts'

export default function BlogSection() {
  const recent = getAllPosts().slice(0, 3)

  return (
    <div className="relative">
      {/* ── Recent posts grid ── */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        {recent.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="col-span-12 md:col-span-4 bg-[#F7F7F9] rounded-3xl p-6 no-underline block group transition-all duration-200 border border-transparent hover:border-[#E4E4E8]"
          >
            <p className="text-xs text-[#ABABAB] mb-2">
              {formatPostDate(post.date)} · {post.readTime}
            </p>
            <h3 className="text-lg font-semibold text-[#0A0A0A] leading-snug mb-4 group-hover:text-[#3A3A3A] transition-colors duration-150">
              {post.title}
            </h3>
            <hr className="border-t border-[#E4E4E8] mb-4" />
            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs text-[#6B6B6B] bg-[#EDEDED] rounded-full px-2.5 py-1">
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
