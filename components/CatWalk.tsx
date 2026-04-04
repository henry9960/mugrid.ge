'use client'

import { useEffect, useState } from 'react'

export default function CatWalk() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('cat-walked')) return
    sessionStorage.setItem('cat-walked', '1')
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 12000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes cat-stroll {
          from { transform: translateX(calc(100vw + 130px)) }
          to   { transform: translateX(-130px) }
        }
        @keyframes cat-bob {
          0%, 100% { transform: translateY(0px) }
          50%       { transform: translateY(-5px) }
        }
        @keyframes tail-sway {
          0%, 100% { transform: rotate(-18deg) }
          50%       { transform: rotate(14deg) }
        }
        @keyframes leg-up {
          0%, 100% { transform: translateY(0px) }
          50%       { transform: translateY(-8px) }
        }
        @keyframes leg-down {
          0%, 100% { transform: translateY(-8px) }
          50%       { transform: translateY(0px) }
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          animation: 'cat-stroll 11s linear forwards',
        }}
      >
        {/* Body bob */}
        <div style={{ animation: 'cat-bob 0.38s ease-in-out infinite' }}>
          <svg width="130" height="100" viewBox="0 0 130 100" fill="none" xmlns="http://www.w3.org/2000/svg">

            {/* ── Tail (right side, curves upward) ── */}
            <g style={{ transformOrigin: '82px 52px', animation: 'tail-sway 0.55s ease-in-out infinite' }}>
              <path
                d="M 82 52 C 104 46 110 30 100 16 C 97 10 104 6 106 11"
                stroke="#c47c2a" strokeWidth="6" strokeLinecap="round" fill="none"
              />
              {/* Tail tip — lighter */}
              <circle cx="106" cy="11" r="4" fill="#f5c06a" />
            </g>

            {/* ── Body ── */}
            <ellipse cx="62" cy="60" rx="30" ry="22" fill="#e8a83a" />

            {/* Belly patch */}
            <ellipse cx="55" cy="64" rx="16" ry="14" fill="#fde68a" />

            {/* Tabby stripes */}
            <path d="M 52 44 Q 62 40 72 44" stroke="#c47c2a" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7" />
            <path d="M 55 51 Q 64 47 74 51" stroke="#c47c2a" strokeWidth="2"   fill="none" strokeLinecap="round" opacity="0.6" />

            {/* ── Head ── */}
            <circle cx="22" cy="48" r="22" fill="#e8a83a" />

            {/* Cheek puffs */}
            <ellipse cx="8"  cy="55" rx="6" ry="5" fill="#f0b84a" opacity="0.6" />

            {/* Forehead stripe */}
            <path d="M 14 30 Q 22 27 30 30" stroke="#c47c2a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />

            {/* ── Ears ── */}
            <polygon points="7,30 13,12 25,30"  fill="#e8a83a" />
            <polygon points="22,30 28,12 40,30" fill="#e8a83a" />
            {/* Inner ears */}
            <polygon points="10,30 15,18 24,30"  fill="#fda4af" />
            <polygon points="24,30 29,18 38,30" fill="#fda4af" />

            {/* ── Eye ── */}
            <ellipse cx="12" cy="46" rx="5.5" ry="6" fill="#2d6a2d" />
            <ellipse cx="12" cy="46" rx="3"   ry="5" fill="#111" />
            {/* Shine */}
            <circle cx="10" cy="44" r="1.4" fill="white" />
            <circle cx="14" cy="48" r="0.7" fill="white" opacity="0.6" />

            {/* ── Nose ── */}
            <polygon points="5,53 8,56.5 2,56.5" fill="#fda4af" />

            {/* ── Mouth ── */}
            <path d="M 2.5 56.5 Q 5 60 8 56.5" stroke="#b06020" strokeWidth="1.4" fill="none" strokeLinecap="round" />

            {/* ── Whiskers ── */}
            <line x1="0"  y1="52" x2="5"  y2="53.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.1" />
            <line x1="0"  y1="56" x2="5"  y2="56"   stroke="rgba(255,255,255,0.7)" strokeWidth="1.1" />
            <line x1="9"  y1="52" x2="3"  y2="50"   stroke="rgba(255,255,255,0.7)" strokeWidth="1.1" />
            <line x1="0"  y1="60" x2="5"  y2="58.5" stroke="rgba(255,255,255,0.5)" strokeWidth="0.9" />

            {/* ── Back legs ── */}
            <g style={{ animation: 'leg-down 0.38s ease-in-out infinite' }}>
              <rect x="70" y="76" width="10" height="18" rx="5" fill="#c47c2a" />
              <ellipse cx="75" cy="94" rx="6" ry="3.5" fill="#b06020" /> {/* paw */}
            </g>
            <g style={{ animation: 'leg-up 0.38s ease-in-out infinite' }}>
              <rect x="57" y="76" width="10" height="18" rx="5" fill="#e8a83a" />
              <ellipse cx="62" cy="94" rx="6" ry="3.5" fill="#c47c2a" />
            </g>

            {/* ── Front legs ── */}
            <g style={{ animation: 'leg-up 0.38s ease-in-out infinite' }}>
              <rect x="37" y="74" width="10" height="18" rx="5" fill="#c47c2a" />
              <ellipse cx="42" cy="92" rx="6" ry="3.5" fill="#b06020" />
            </g>
            <g style={{ animation: 'leg-down 0.38s ease-in-out infinite' }}>
              <rect x="24" y="74" width="10" height="18" rx="5" fill="#e8a83a" />
              <ellipse cx="29" cy="92" rx="6" ry="3.5" fill="#c47c2a" />
            </g>

          </svg>
        </div>
      </div>
    </>
  )
}
