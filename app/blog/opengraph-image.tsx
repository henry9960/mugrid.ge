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
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0A0A0A' }} />
          <div style={{ fontSize: '22px', fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Writing & Ideas
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{ fontSize: '96px', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-3px', lineHeight: 1.0 }}>
            Blog
          </div>
          <div style={{ fontSize: '36px', color: '#6B6B6B', lineHeight: 1.4, maxWidth: '820px' }}>
            Thoughts on product, AI, and building things that matter.
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
            <div style={{ fontSize: '22px', fontWeight: 600, color: '#0A0A0A' }}>Harry Mugridge</div>
          </div>
          <div style={{ fontSize: '22px', color: '#ABABAB' }}>harry.mugrid.ge</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
