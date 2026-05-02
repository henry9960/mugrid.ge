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
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          padding: '72px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Tags */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {post.tags.slice(0, 3).map(tag => (
            <div
              key={tag}
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#6B6B6B',
                backgroundColor: '#F0F0F3',
                borderRadius: '9999px',
                padding: '6px 18px',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Title + description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              fontSize: post.title.length > 50 ? '68px' : '80px',
              fontWeight: 700,
              color: '#0A0A0A',
              lineHeight: 1.05,
              letterSpacing: '-2px',
            }}
          >
            {post.title}
          </div>
          <div style={{ fontSize: '32px', color: '#6B6B6B', lineHeight: 1.4, maxWidth: '860px' }}>
            {post.description}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '52px', height: '52px', borderRadius: '50%',
                backgroundColor: '#0A0A0A', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', fontWeight: 700, color: '#ffffff',
              }}
            >
              H
            </div>
            <div style={{ fontSize: '22px', fontWeight: 600, color: '#0A0A0A' }}>
              Harry Mugridge
            </div>
          </div>
          <div style={{ fontSize: '22px', color: '#ABABAB' }}>harry.mugrid.ge</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
