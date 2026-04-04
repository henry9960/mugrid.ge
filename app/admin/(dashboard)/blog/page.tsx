'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import type { PostMeta } from '@/lib/posts'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<PostMeta[] | null>(null)
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    fetch('/api/admin/posts')
      .then(r => r.json())
      .then(setPosts)
  }

  useEffect(load, [])

  const handleDelete = async () => {
    if (!deleteSlug) return
    setDeleting(true)
    try {
      await fetch(`/api/admin/posts?slug=${deleteSlug}`, { method: 'DELETE' })
      setDeleteSlug(null)
      load()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#0A0A0A' }}>
            Blog
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#ABABAB' }}>
            {posts ? `${posts.length} post${posts.length !== 1 ? 's' : ''}` : 'Loading…'}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
          style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New post
        </Link>
      </div>

      {!posts ? (
        <p className="text-sm" style={{ color: '#ABABAB' }}>Loading…</p>
      ) : posts.length === 0 ? (
        <div
          className="rounded-3xl p-10 text-center"
          style={{ backgroundColor: '#F7F7F9' }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: '#6B6B6B' }}>
            No posts yet
          </p>
          <p className="text-xs mb-4" style={{ color: '#ABABAB' }}>
            Create your first post to get started.
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF' }}
          >
            New post
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <div
              key={post.slug}
              className="rounded-2xl flex items-center gap-4 px-4 py-3 transition-colors group"
              style={{ backgroundColor: '#F7F7F9', border: '1px solid transparent' }}
              onMouseEnter={e =>
                ((e.currentTarget as HTMLElement).style.borderColor = '#E4E4E8')
              }
              onMouseLeave={e =>
                ((e.currentTarget as HTMLElement).style.borderColor = 'transparent')
              }
            >
              {/* Meta */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: '#0A0A0A' }}>
                  {post.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs" style={{ color: '#ABABAB' }}>
                    {post.date}
                  </span>
                  <span style={{ color: '#E4E4E8' }}>·</span>
                  <span className="text-xs" style={{ color: '#ABABAB' }}>
                    {post.readTime}
                  </span>
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] rounded-full px-2 py-0.5"
                      style={{ backgroundColor: '#EDEDED', color: '#6B6B6B' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                  style={{ backgroundColor: '#EDEDED', color: '#6B6B6B' }}
                  title="View post"
                  onMouseEnter={e =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = '#E0E0E0')
                  }
                  onMouseLeave={e =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = '#EDEDED')
                  }
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </Link>
                <Link
                  href={`/admin/blog/${post.slug}`}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                  style={{ backgroundColor: '#EDEDED', color: '#6B6B6B' }}
                  title="Edit post"
                  onMouseEnter={e =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = '#E0E0E0')
                  }
                  onMouseLeave={e =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = '#EDEDED')
                  }
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </Link>
                <button
                  onClick={() => setDeleteSlug(post.slug)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                  style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
                  title="Delete post"
                  onMouseEnter={e =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = '#FEE2E2')
                  }
                  onMouseLeave={e =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = '#FEF2F2')
                  }
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteSlug !== null}
        title="Delete post?"
        message={`"${posts?.find(p => p.slug === deleteSlug)?.title ?? deleteSlug}" will be permanently deleted.`}
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteSlug(null)}
      />
    </div>
  )
}
