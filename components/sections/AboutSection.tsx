'use client'

import { useState } from 'react'

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
]

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
                          style={{ backgroundColor: isActive ? '#C8E6C9' : '#E4E4E8' }}
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

                      ) : (
                        /* ACTIVE or INACTIVE: plain row */
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 overflow-hidden">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p
                                className="text-sm font-semibold whitespace-pre-line"
                                style={{ color: isInactive ? '#7A7A7A' : '#0A0A0A' }}
                              >
                                {item.company}
                              </p>
                              {isActive && (
                                <span
                                  className="text-[10px] font-semibold rounded-full px-1.5 py-0.5 flex-shrink-0"
                                  style={{ color: '#3A7D44', backgroundColor: '#EDFAF1' }}
                                >
                                  Now
                                </span>
                              )}
                            </div>
                            <p
                              className="text-xs"
                              style={{ color: isInactive ? '#9A9A9A' : '#6B6B6B' }}
                            >
                              {item.role}
                            </p>
                            <p
                              className="text-xs mt-0.5 truncate"
                              style={{ color: isInactive ? '#C0C0C6' : '#ABABAB' }}
                            >
                              {item.description}
                            </p>
                          </div>
                          <span
                            className="text-xs whitespace-nowrap ml-3 mt-0.5 flex-shrink-0"
                            style={{ color: isInactive ? '#C0C0C6' : '#ABABAB' }}
                          >
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
