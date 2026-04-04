'use client'

import { useEffect, useState } from 'react'

export default function CatWalk() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('cat-walked')) return
    sessionStorage.setItem('cat-walked', '1')
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 11000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes cat-stroll {
          from { transform: translateX(-110px) }
          to   { transform: translateX(calc(100vw + 110px)) }
        }
        @keyframes cat-bob {
          0%, 100% { transform: translateY(0px) }
          50%       { transform: translateY(-4px) }
        }
        @keyframes tail-wag {
          0%, 100% { transform-origin: 4px 0px; transform: rotate(-15deg) }
          50%       { transform-origin: 4px 0px; transform: rotate(15deg) }
        }
        @keyframes leg-a {
          0%, 100% { transform-origin: top center; transform: rotate(-18deg) }
          50%       { transform-origin: top center; transform: rotate(18deg) }
        }
        @keyframes leg-b {
          0%, 100% { transform-origin: top center; transform: rotate(18deg) }
          50%       { transform-origin: top center; transform: rotate(-18deg) }
        }
      `}</style>

      {/* Walking container — moves across the screen */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          animation: 'cat-stroll 10s linear forwards',
        }}
      >
        {/* Bob wrapper */}
        <div style={{ animation: 'cat-bob 0.4s ease-in-out infinite' }}>
          <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">

            {/* Tail */}
            <g style={{ animation: 'tail-wag 0.6s ease-in-out infinite' }}>
              <path
                d="M 76 44 C 92 36 94 22 86 12"
                stroke="#3d3d3d" strokeWidth="4.5" strokeLinecap="round" fill="none"
              />
            </g>

            {/* Body */}
            <ellipse cx="54" cy="50" rx="24" ry="17" fill="#3d3d3d" />

            {/* Head */}
            <circle cx="20" cy="40" r="17" fill="#3d3d3d" />

            {/* Ears */}
            <polygon points="8,26 13,11 23,26"  fill="#3d3d3d" />
            <polygon points="20,26 25,11 34,26" fill="#3d3d3d" />
            {/* Inner ears */}
            <polygon points="10,26 14,16 22,26"  fill="#fda4af" />
            <polygon points="22,26 26,16 32,26" fill="#fda4af" />

            {/* Eye */}
            <ellipse cx="12" cy="38" rx="3.5" ry="4.5" fill="white" />
            <ellipse cx="12" cy="38" rx="2"   ry="3.5" fill="#1a1a1a" />
            <circle  cx="11" cy="37" r="0.8"  fill="white" />

            {/* Nose */}
            <polygon points="5.5,44 8,46.5 3,46.5" fill="#fda4af" />

            {/* Mouth */}
            <path d="M 3.5 46.5 Q 5.5 49 8 46.5" stroke="#666" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* Whiskers */}
            <line x1="0"  y1="43" x2="5"  y2="44" stroke="#aaa" strokeWidth="0.9" />
            <line x1="0"  y1="46" x2="5"  y2="46" stroke="#aaa" strokeWidth="0.9" />
            <line x1="9"  y1="43" x2="4"  y2="41" stroke="#aaa" strokeWidth="0.9" />

            {/* Back legs */}
            <rect x="62" y="63" width="8" height="14" rx="4" fill="#2e2e2e"
              style={{ animation: 'leg-b 0.4s ease-in-out infinite' }} />
            <rect x="51" y="63" width="8" height="14" rx="4" fill="#3d3d3d"
              style={{ animation: 'leg-a 0.4s ease-in-out infinite' }} />

            {/* Front legs */}
            <rect x="36" y="63" width="8" height="14" rx="4" fill="#2e2e2e"
              style={{ animation: 'leg-a 0.4s ease-in-out infinite' }} />
            <rect x="25" y="63" width="8" height="14" rx="4" fill="#3d3d3d"
              style={{ animation: 'leg-b 0.4s ease-in-out infinite' }} />
          </svg>
        </div>
      </div>
    </>
  )
}
