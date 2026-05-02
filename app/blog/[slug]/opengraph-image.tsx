import { ImageResponse } from 'next/og'
import { getPostBySlug, getAllPosts } from '@/lib/posts'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          padding: '72px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div style={{ display: 'flex', width: '48px', height: '4px', backgroundColor: '#0A0A0A', borderRadius: '2px', marginBottom: '48px' }} />

        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {post.tags.slice(0, 3).map(tag => (
            <div
              key={tag}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#6B6B6B',
                backgroundColor: '#F0F0F3',
                borderRadius: '9999px',
                padding: '4px 12px',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: post.title.length > 50 ? '52px' : '62px',
            fontWeight: 700,
            color: '#0A0A0A',
            lineHeight: 1.15,
            letterSpacing: '-1px',
            flex: 1,
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          {post.title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '22px',
            color: '#6B6B6B',
            lineHeight: 1.5,
            marginBottom: '48px',
            maxWidth: '800px',
          }}
        >
          {post.description}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#0A0A0A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              H
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#0A0A0A' }}>
              Harry Mugridge
            </div>
          </div>
          <div style={{ fontSize: '16px', color: '#ABABAB' }}>
            harry.mugrid.ge
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
