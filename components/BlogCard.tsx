'use client'

import { useState } from 'react'
import Link from 'next/link'

interface BlogCardProps {
  href: string
  date: string
  readTime: string
  title: string
  description?: string
  tags: string[]
  co: { color: string; bg: string; border: string } | null
}

export default function BlogCard({ href, date, readTime, title, description, tags, co }: BlogCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      className="col-span-12 md:col-span-4 rounded-3xl p-6 no-underline block group transition-all duration-200"
      style={{
        backgroundColor: co ? co.bg : '#F7F7F9',
        border: `1px solid ${hovered ? '#E4E4E8' : (co ? co.border : 'transparent')}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p className="text-xs text-[#ABABAB] mb-1">
        {date} · {readTime}
      </p>
      <h3 className="text-lg font-semibold text-[#0A0A0A] leading-snug mb-1 group-hover:text-[#3A3A3A] transition-colors duration-150 truncate">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[#6B6B6B] truncate mb-4">{description}</p>
      )}
      <hr className="border-t mb-4" style={{ borderColor: co ? co.border : '#E4E4E8' }} />
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {tags.map(tag => (
            <span key={tag} className="text-xs text-[#6B6B6B] bg-[#EDEDED] rounded-full px-2.5 py-1">
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
}
