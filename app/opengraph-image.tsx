import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
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
        {/* Top label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
          <div style={{ fontSize: '22px', fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Product Manager · Microsoft
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{ fontSize: '96px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-3px', lineHeight: 1.0 }}>
            Harry Mugridge
          </div>
          <div style={{ fontSize: '36px', color: '#6B6B6B', lineHeight: 1.4, maxWidth: '820px' }}>
            Welcome to my corner on the internet to build and share ideas.
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['Product', 'AI', 'Building'].map(tag => (
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
          <div style={{ fontSize: '22px', color: '#ABABAB' }}>harry.mugrid.ge</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
