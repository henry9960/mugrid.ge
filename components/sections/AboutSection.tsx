const ABOUT_BLOCKS = [
  {
    label: 'Background',
    text: 'WIP',
  },
  {
    label: 'Past',
    text: 'WIP',
  },
  {
    label: 'Present',
    text: 'WIP',
  },
  {
    label: 'Future',
    text: 'WIP',
  },
  {
    label: 'Hobbies',
    text: 'WIP',
  },
]

const TIMELINE = [
  {
    company: 'Microsoft',
    role: 'Product Manager Intern',
    description: 'Working on MSAI products.',
    period: 'Summer 2026',
    current: true,
  },
  {
    company: 'Intel',
    role: 'Pricing Strategy Analyst Intern',
    description: 'Working on pricing CPU strategies.',
    period: "Sep '25 – Jul '26",
  },
  {
    company: 'TikTok',
    role: 'Merchant Strategy & Operations Intern',
    description: 'Worked on strategic growth for merchants.',
    period: "Jun – Sep '25",
  },
  {
    company: 'Amazon',
    role: 'Program Manager Intern',
    description: 'Worked on improving carrier rail compliance.',
    period: "Feb – Jun '25",
  },
  {
    company: 'Spotify',
    role: 'Product Manager Intern',
    description: 'Worked on AI features for users.',
    period: "Jun – Aug '24",
  },
  {
    company: 'Royal Holloway,\nUniversity of London',
    role: 'Business and Management Student',
    description: 'Expected to achieve a first class degree.',
    period: '2023 – 2027',
  },
]

function Divider() {
  return <hr className="border-t border-[#E4E4E8] my-4" />
}

export default function AboutSection() {
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

        {/* Scrollable list + fade mask */}
        <div className="relative">
          <div
            className="overflow-y-auto max-h-[340px]"
            style={{ scrollbarWidth: 'none' }}
          >
            <style>{`
              .timeline-scroll::-webkit-scrollbar { display: none; }
              @keyframes scroll-hint {
                0%, 100% { transform: translateY(0px); opacity: 0.45; }
                50%       { transform: translateY(4px); opacity: 1; }
              }
            `}</style>
            <div className="timeline-scroll space-y-0 pr-1">
              {TIMELINE.map((item, i) => (
                <div key={item.company} className="flex gap-4">
                  {/* Line + dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 border-2"
                      style={{
                        backgroundColor: item.current ? '#0A0A0A' : '#F7F7F9',
                        borderColor: item.current ? '#0A0A0A' : '#CBCBD0',
                      }}
                    />
                    {i < TIMELINE.length - 1 && (
                      <div className="w-px flex-1 bg-[#E4E4E8] my-1.5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 min-w-0 ${i === TIMELINE.length - 1 ? 'pb-8' : 'pb-6'}`}>
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 overflow-hidden">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-[#0A0A0A] whitespace-pre-line">{item.company}</p>
                          {item.current && (
                            <span
                              className="text-[10px] font-semibold rounded-full px-1.5 py-0.5"
                              style={{ color: '#3A7D44', backgroundColor: '#EDFAF1' }}
                            >
                              Now
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#6B6B6B]">{item.role}</p>
                        <p className="text-xs text-[#ABABAB] mt-0.5 truncate">{item.description}</p>
                      </div>
                      <span className="text-xs text-[#ABABAB] whitespace-nowrap ml-3 mt-0.5 flex-shrink-0">
                        {item.period}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fade + scroll cue */}
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none flex flex-col items-center justify-end pb-1"
            style={{ background: 'linear-gradient(to bottom, transparent, #F7F7F9)' }}
          >
            <span
              className="flex flex-col items-center gap-0.5"
              style={{ animation: 'scroll-hint 1.5s ease-in-out infinite' }}
            >
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
