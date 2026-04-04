'use client'

import { useState, useRef, useEffect } from 'react'

const ABOUT_BLOCKS = [
  { label: 'Background', text: 'WIP' },
  { label: 'Past',       text: 'WIP' },
  { label: 'Present',    text: 'WIP' },
  { label: 'Future',     text: 'WIP' },
  { label: 'Hobbies',   text: 'WIP' },
]

type TimelineState = 'active' | 'highlighted' | 'inactive'

interface TimelineEntry {
  company:     string
  role:        string
  description: string
  period:      string
  state:       TimelineState
  detail?:     string
  badgeLabel?: string
}

const TIMELINE: TimelineEntry[] = [
  {
    company:     'Microsoft',
    role:        'Product Manager Intern',
    description: 'Working on MSAI products.',
    period:      'Summer 2026',
    state:       'active',
  },
  {
    company:     'Intel',
    role:        'Pricing Strategy Analyst Intern',
    description: 'Working on pricing CPU strategies.',
    period:      "Sep '25 – Jul '26",
    state:       'inactive',
  },
  {
    company:     'TikTok',
    role:        'Merchant Strategy & Operations Intern',
    description: 'Worked on strategic growth for merchants.',
    period:      "Jun – Sep '25",
    state:       'inactive',
  },
  {
    company:     'Amazon',
    role:        'Program Manager Intern',
    description: 'Worked on improving carrier rail compliance.',
    period:      "Feb – Jun '25",
    state:       'inactive',
  },
  {
    company:     'Spotify',
    role:        'Product Manager Intern',
    description: 'Worked on AI features for users.',
    period:      "Jun – Aug '24",
    state:       'highlighted',
    detail:      'WIP — add detail about what you shipped, your impact, and the team you worked with.',
  },
  {
    company:     'Royal Holloway',
    role:        'Business and Management Student',
    description: 'Expected to achieve a first class degree.',
    period:      '2023 – 2027',
    state:       'highlighted',
    badgeLabel:  'University',
    detail:      'WIP — add society roles, leadership positions, sports teams, and other campus activities here.',
  },
  {
    company:     'Comikey',
    role:        'Product Manager, Reader Experience',
    description: 'Spearheaded improvements to the reader experience.',
    period:      "May '21 – Jun '24",
    state:       'inactive',
  },
  {
    company:     'CatManga',
    role:        'Founder & Product Manager',
    description: 'Founded a non-profit localisation group.',
    period:      "Jun '19 – Nov '21",
    state:       'highlighted',
    badgeLabel:  'Key exp.',
    detail:      'Grew the team to over 50 members, and launched a fan publishing platform which localised over 60 Japanese comics, generating over 35 million monthly page views.',
  },
]

const MS_NODE_COLORS = ['#F25022', '#7FBA00', '#00A4EF', '#FFB900']

function NeuralNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height

    const nodes = Array.from({ length: 16 }, () => ({
      x:          Math.random() * W,
      y:          Math.random() * H,
      vx:         (Math.random() - 0.5) * 0.35,
      vy:         (Math.random() - 0.5) * 0.35,
      r:          1 + Math.random() * 1.2,
      opacity:    0.3 + Math.random() * 0.6,
      opacityDir: Math.random() > 0.5 ? 1 : -1 as 1 | -1,
      color:      MS_NODE_COLORS[Math.floor(Math.random() * MS_NODE_COLORS.length)],
    }))

    const CONNECT_DIST = 70

    function draw() {
      ctx!.clearRect(0, 0, W, H)

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
        n.opacity += n.opacityDir * 0.004
        if (n.opacity > 0.9)  { n.opacity = 0.9;  n.opacityDir = -1 }
        if (n.opacity < 0.15) { n.opacity = 0.15; n.opacityDir =  1 }
      }

      // lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            ctx!.strokeStyle = `rgba(120,120,140,${(1 - dist / CONNECT_DIST) * 0.18})`
            ctx!.lineWidth = 0.6
            ctx!.beginPath()
            ctx!.moveTo(nodes[i].x, nodes[i].y)
            ctx!.lineTo(nodes[j].x, nodes[j].y)
            ctx!.stroke()
          }
        }
      }

      // nodes
      for (const n of nodes) {
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        // parse hex colour → rgba with opacity
        const r = parseInt(n.color.slice(1, 3), 16)
        const g = parseInt(n.color.slice(3, 5), 16)
        const b = parseInt(n.color.slice(5, 7), 16)
        ctx!.fillStyle = `rgba(${r},${g},${b},${n.opacity * 0.65})`
        ctx!.fill()
      }
    }

    let animId: number
    const loop = () => { draw(); animId = requestAnimationFrame(loop) }
    loop()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={100}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        borderRadius: '10.5px',
        pointerEvents: 'none',
      }}
    />
  )
}

function Divider() {
  return <hr className="border-t border-[#E4E4E8] my-4" />
}

function Dot({ state }: { state: TimelineState }) {
  if (state === 'active') {
    return (
      <div
        className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0"
        style={{ backgroundColor: '#0A0A0A' }}
      />
    )
  }
  if (state === 'highlighted') {
    return (
      <div
        className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
        style={{
          backgroundColor: '#0A0A0A',
          boxShadow: '0 0 0 2px #F7F7F9, 0 0 0 3.5px #0A0A0A',
        }}
      />
    )
  }
  // inactive
  return (
    <div
      className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 border-2"
      style={{ backgroundColor: '#F7F7F9', borderColor: '#D4D4D8' }}
    />
  )
}

export default function AboutSection() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-12 gap-4">

      {/* ── About card ────────────────────────────────── */}
      <div className="col-span-12 md:col-span-7 bg-[#F7F7F9] rounded-3xl p-8">
        <h2 className="text-2xl font-semibold text-[#0A0A0A]">About</h2>
        <Divider />
        <div className="space-y-5">
          {ABOUT_BLOCKS.map((block) => (
            <div key={block.label}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#ABABAB] mb-1.5">
                {block.label}
              </p>
              <p className="text-[15px] text-[#6B6B6B] leading-relaxed">{block.text}</p>
            </div>
          ))}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#ABABAB] mb-1.5">
              Location
            </p>
            <p className="text-[15px] text-[#6B6B6B]">London, UK · Open to remote</p>
          </div>
        </div>
      </div>

      {/* ── Timeline card ─────────────────────────────── */}
      <div className="col-span-12 md:col-span-5 bg-[#F7F7F9] rounded-3xl p-8">
        <h2 className="text-2xl font-semibold text-[#0A0A0A]">Timeline</h2>
        <Divider />

        <div className="relative">
          <div className="overflow-y-auto max-h-[380px]" style={{ scrollbarWidth: 'none' }}>
            <style>{`
              .timeline-scroll::-webkit-scrollbar { display: none; }
              @keyframes scroll-hint {
                0%, 100% { transform: translateY(0px); opacity: 0.45; }
                50%       { transform: translateY(4px); opacity: 1; }
              }
              @keyframes ms-border-spin {
                from { transform: rotate(0deg); }
                to   { transform: rotate(360deg); }
              }
              @keyframes ms-shimmer {
                0%   { background-position: -200% center; }
                100% { background-position:  200% center; }
              }
            `}</style>
            <div className="timeline-scroll space-y-0 px-1">
              {TIMELINE.map((item, i) => {
                const isLast       = i === TIMELINE.length - 1
                const isExpanded   = expanded === item.company
                const isActive     = item.state === 'active'
                const isHighlighted = item.state === 'highlighted'
                const isInactive   = item.state === 'inactive'

                return (
                  <div key={item.company} className="flex gap-4">

                    {/* ── Dot + line ── */}
                    <div className="flex flex-col items-center">
                      <Dot state={item.state} />
                      {!isLast && (
                        <div
                          className="w-px flex-1 my-1.5"
                          style={{ backgroundColor: '#E4E4E8' }}
                        />
                      )}
                    </div>

                    {/* ── Content ── */}
                    <div className={`flex-1 min-w-0 ${isLast ? 'pb-8' : 'pb-4'}`}>

                      {/* HIGHLIGHTED: card treatment */}
                      {isHighlighted ? (
                        <div
                          className="rounded-xl border cursor-pointer select-none"
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderColor: '#E4E4E8',
                            padding: '10px 12px',
                          }}
                          onClick={() => setExpanded(isExpanded ? null : item.company)}
                        >
                          {/* Header row */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 overflow-hidden">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <p className="text-sm font-semibold text-[#0A0A0A] whitespace-pre-line">
                                  {item.company}
                                </p>
                                <span
                                  className="text-[9px] font-semibold rounded-full px-1.5 py-0.5 flex-shrink-0"
                                  style={{ color: '#6B6B6B', backgroundColor: '#F0F0F3' }}
                                >
                                  {item.badgeLabel ?? 'Key exp.'}
                                </span>
                              </div>
                              <p className="text-xs text-[#6B6B6B]">{item.role}</p>
                              <p className="text-xs text-[#ABABAB] mt-0.5 truncate">{item.description}</p>
                            </div>
                            <div className="flex flex-col items-end flex-shrink-0 gap-1.5">
                              <span className="text-xs text-[#ABABAB] whitespace-nowrap">{item.period}</span>
                              <svg
                                width="12" height="12" viewBox="0 0 24 24"
                                fill="none" stroke="#ABABAB" strokeWidth="2.5"
                                strokeLinecap="round" strokeLinejoin="round"
                                style={{
                                  transition: 'transform 0.25s ease',
                                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                }}
                              >
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                            </div>
                          </div>

                          {/* Expandable detail */}
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateRows: isExpanded ? '1fr' : '0fr',
                              transition: 'grid-template-rows 0.25s ease',
                            }}
                          >
                            <div style={{ overflow: 'hidden' }}>
                              <hr className="border-t border-[#E4E4E8] mt-2.5 mb-2.5" />
                              <p className="text-xs leading-relaxed" style={{ color: '#6B6B6B' }}>
                                {item.detail}
                              </p>
                            </div>
                          </div>
                        </div>

                      ) : isActive ? (
                        /* ACTIVE: spinning MS gradient border card */
                        <div style={{ position: 'relative', borderRadius: '12px', padding: '1px', overflow: 'hidden' }}>
                          {/* Spinning conic gradient — creates the animated border */}
                          <div style={{
                            position: 'absolute',
                            width: '300%', height: '300%',
                            top: '-100%', left: '-100%',
                            background: 'conic-gradient(from 0deg, #F2502260, #FFB90060, #7FBA0060, #00A4EF60, #F2502260)',
                            animation: 'ms-border-spin 6s linear infinite',
                          }} />
                          {/* Light card interior */}
                          <div style={{
                            position: 'relative',
                            borderRadius: '10.5px',
                            padding: '10px 12px',
                            background: '#ffffff',
                            overflow: 'hidden',
                          }}>
                            <NeuralNetworkCanvas />
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0A', margin: 0 }}>
                                    {item.company}
                                  </p>
                                  <span style={{
                                    fontSize: '10px', fontWeight: 600, flexShrink: 0,
                                    color: '#3A7D44', backgroundColor: '#EDFAF1',
                                    borderRadius: '9999px', padding: '1px 6px',
                                  }}>
                                    Now
                                  </span>
                                </div>
                                <p style={{ fontSize: '12px', color: '#6B6B6B', margin: 0 }}>{item.role}</p>
                                <p style={{ fontSize: '12px', color: '#ABABAB', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</p>
                              </div>
                              <span style={{ fontSize: '12px', color: '#ABABAB', whiteSpace: 'nowrap', flexShrink: 0, marginTop: '1px' }}>
                                {item.period}
                              </span>
                            </div>
                          </div>
                        </div>

                      ) : (
                        /* INACTIVE: plain muted row */
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 overflow-hidden">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-semibold whitespace-pre-line" style={{ color: '#7A7A7A' }}>
                                {item.company}
                              </p>
                            </div>
                            <p className="text-xs" style={{ color: '#9A9A9A' }}>{item.role}</p>
                            <p className="text-xs mt-0.5 truncate" style={{ color: '#C0C0C6' }}>{item.description}</p>
                          </div>
                          <span className="text-xs whitespace-nowrap ml-3 mt-0.5 flex-shrink-0" style={{ color: '#C0C0C6' }}>
                            {item.period}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Fade + scroll cue */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none flex flex-col items-center justify-end pb-1"
            style={{ background: 'linear-gradient(to bottom, transparent, #F7F7F9)' }}
          >
            <span style={{ animation: 'scroll-hint 1.5s ease-in-out infinite' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}
