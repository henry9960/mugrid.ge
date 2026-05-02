'use client'

import { useState, useRef, useEffect } from 'react'
import ExternalLinkButton from '@/components/ExternalLinkButton'
import type { AboutContent, TimelineState } from '@/lib/types/content'

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

      for (const n of nodes) {
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2)
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

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function Divider() {
  return <hr className="border-t border-[#E4E4E8] my-4" />
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  'Internship': { bg: '#EEF2FF', text: '#4060C8' },
  'University': { bg: '#FFF4E6', text: '#C2651A' },
  'Start-up':   { bg: '#F3EEFF', text: '#7248C8' },
  'Part-time':  { bg: '#E6F7F5', text: '#1F8F82' },
}

interface AboutSectionProps {
  data: AboutContent
}

export default function AboutSection({ data }: AboutSectionProps) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [arrowHovered, setArrowHovered] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  function scrollTimeline() {
    const el = scrollRef.current
    if (!el) return
    const start = el.scrollTop
    const target = start + 220
    const duration = 600
    const startTime = performance.now()
    function ease(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }
    function step(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      el!.scrollTop = start + (target - start) * ease(progress)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  return (
    <div className="grid grid-cols-12 gap-4 items-stretch">

      {/* ── About card ────────────────────────────────── */}
      <div className="col-span-12 md:col-span-7 bg-[#F7F7F9] rounded-3xl p-8 flex flex-col">
        <h2 className="text-2xl font-semibold text-[#0A0A0A]">About</h2>
        <Divider />
        <div className="space-y-5">
          {data.blocks.map((block) => (
            <div key={block.id}>
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
            <p className="text-[15px] text-[#6B6B6B]">{data.location}</p>
          </div>
        </div>
      </div>

      {/* ── Timeline card ─────────────────────────────── */}
      <div className="col-span-12 md:col-span-5 bg-[#F7F7F9] rounded-3xl p-8 flex flex-col">
        <h2 className="text-2xl font-semibold text-[#0A0A0A]">Timeline</h2>
        <Divider />

        <div className="relative flex-1 min-h-0 overflow-hidden">
          <div
            ref={scrollRef}
            className="overflow-y-auto md:absolute md:inset-0 max-h-[480px] md:max-h-none"
            style={{
              scrollbarWidth: 'none',
              maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
            }}
          >
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
            <div className="timeline-scroll space-y-0 pb-10">
              {data.timeline.map((item, i) => {
                const isFirst       = i === 0
                const isLast        = i === data.timeline.length - 1
                const isExpanded    = expanded === item.id
                const isActive      = item.state === 'active'
                const isHighlighted = item.state === 'highlighted'
                const isInactive    = item.state === 'inactive'
                const pillStyle     = TAG_COLORS[item.tag ?? ''] ?? { bg: '#EDEDF0', text: '#6B6B6B' }
                const cardBorderColor = item.accentColor ? hexToRgba(item.accentColor, 0.35) : '#E4E4E8'
                const cardBgColor     = item.accentColor ? hexToRgba(item.accentColor, 0.06) : '#FFFFFF'
                const DOT_CENTER = 15

                return (
                  <div key={item.id} style={{ display: 'flex', gap: '14px' }}>

                    {/* ── Continuous line + dot ── */}
                    <div style={{ position: 'relative', width: 12, flexShrink: 0 }}>
                      <div style={{
                        position: 'absolute',
                        left: '50%', transform: 'translateX(-50%)',
                        width: 1, backgroundColor: '#E4E4E8',
                        top: isFirst ? DOT_CENTER : 0,
                        ...(isLast ? { height: DOT_CENTER } : { bottom: 0 }),
                      }} />
                      <svg width="8" height="8" viewBox="0 0 8 8"
                        style={{ display: 'block', position: 'relative', zIndex: 1, marginTop: 11, marginLeft: 2 }}>
                        <circle cx="4" cy="4"
                          r={isInactive ? 2.5 : 3.5}
                          fill={isInactive ? '#F7F7F9' : '#0A0A0A'}
                          stroke={isInactive ? '#C8C8D0' : 'none'}
                          strokeWidth={isInactive ? 1.5 : 0}
                        />
                      </svg>
                    </div>

                    {/* ── Card ── */}
                    <div style={{ flex: 1, minWidth: 0, paddingBottom: isLast ? '2px' : '5px' }}>

                      {isActive ? (
                        <div style={{ position: 'relative', borderRadius: '12px', padding: '1px', overflow: 'hidden' }}>
                          <div style={{
                            position: 'absolute', width: '300%', height: '300%', top: '-100%', left: '-100%',
                            background: 'conic-gradient(from 0deg, #F2502260, #FFB90060, #7FBA0060, #00A4EF60, #F2502260)',
                            animation: 'ms-border-spin 6s linear infinite',
                          }} />
                          <div style={{ position: 'relative', borderRadius: '10.5px', padding: '8px 12px', background: '#ffffff', overflow: 'hidden', cursor: 'pointer' }}
                            onClick={() => setExpanded(isExpanded ? null : item.id)}>
                            <NeuralNetworkCanvas />
                            <div style={{ position: 'relative' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0A' }}>{item.company}</span>
                                <span style={{ fontSize: '9px', fontWeight: 600, color: '#3A7D44', backgroundColor: '#EDFAF1', borderRadius: '9999px', padding: '2px 6px', flexShrink: 0 }}>Now</span>
                                {item.tag && <span style={{ fontSize: '9px', fontWeight: 600, color: pillStyle.text, backgroundColor: pillStyle.bg, borderRadius: '9999px', padding: '2px 6px', flexShrink: 0 }}>{item.tag}</span>}
                                {item.href && <ExternalLinkButton href={item.href} size={20} bg="rgba(0,0,0,0.06)" color="#6B6B6B" hoverBg="rgba(0,0,0,0.12)" onClick={e => e.stopPropagation()} />}
                                <span style={{ fontSize: '11px', color: '#ABABAB', marginLeft: 'auto', whiteSpace: 'nowrap', flexShrink: 0 }}>{item.period}</span>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                  style={{ transition: 'transform 0.25s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                                  <path d="M6 9l6 6 6-6" />
                                </svg>
                              </div>
                              <p style={{ fontSize: '12px', color: '#6B6B6B', margin: '0 0 2px' }}>{item.role}</p>
                              <p style={{ fontSize: '12px', color: '#ABABAB', margin: 0, lineHeight: 1.5 }}>{item.description}</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateRows: isExpanded ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
                              <div style={{ overflow: 'hidden' }}>
                                <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.07)', margin: '8px 0' }} />
                                <p style={{ fontSize: '12px', color: '#6B6B6B', lineHeight: 1.6, margin: 0 }}>{item.detail ?? item.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                      ) : (
                        <div
                          style={{
                            borderRadius: '12px',
                            border: `1px solid ${isHighlighted ? cardBorderColor : '#E4E4E8'}`,
                            backgroundColor: isHighlighted ? cardBgColor : '#FFFFFF',
                            padding: '8px 12px',
                            cursor: 'pointer',
                          }}
                          onClick={() => setExpanded(isExpanded ? null : item.id)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0A' }}>{item.company}</span>
                            {item.tag && <span style={{ fontSize: '9px', fontWeight: 600, color: pillStyle.text, backgroundColor: pillStyle.bg, borderRadius: '9999px', padding: '2px 6px', flexShrink: 0 }}>{item.tag}</span>}
                            {item.href && <ExternalLinkButton href={item.href} size={20} bg="rgba(0,0,0,0.06)" color="#6B6B6B" hoverBg="rgba(0,0,0,0.12)" onClick={e => e.stopPropagation()} />}
                            <span style={{ fontSize: '11px', color: '#ABABAB', marginLeft: 'auto', whiteSpace: 'nowrap', flexShrink: 0 }}>{item.period}</span>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                              style={{ transition: 'transform 0.25s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </div>
                          <p style={{ fontSize: '12px', color: '#6B6B6B', margin: 0 }}>{item.role}</p>
                          {isHighlighted && (
                            <div style={{ display: 'grid', gridTemplateRows: isExpanded ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
                              <div style={{ overflow: 'hidden' }}>
                                <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.07)', margin: '8px 0' }} />
                                <p style={{ fontSize: '12px', color: '#6B6B6B', lineHeight: 1.6, margin: 0 }}>{item.detail ?? item.description}</p>
                              </div>
                            </div>
                          )}
                          {isInactive && (
                            <div style={{ display: 'grid', gridTemplateRows: isExpanded ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
                              <div style={{ overflow: 'hidden' }}>
                                <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.07)', margin: '8px 0' }} />
                                <p style={{ fontSize: '12px', color: '#6B6B6B', lineHeight: 1.6, margin: 0 }}>{item.description}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-10 flex flex-col items-center justify-end pb-1"
            style={{ background: 'linear-gradient(to bottom, transparent, #F7F7F9)', pointerEvents: 'none' }}
          >
            <button
              onClick={scrollTimeline}
              onMouseEnter={() => setArrowHovered(true)}
              onMouseLeave={() => setArrowHovered(false)}
              style={{
                pointerEvents: 'auto',
                background: arrowHovered ? 'rgba(0,0,0,0.07)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background 0.2s ease, opacity 0.2s ease',
                opacity: arrowHovered ? 1 : 0.45,
                animation: arrowHovered ? 'none' : 'scroll-hint 1.5s ease-in-out infinite',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ABABAB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
