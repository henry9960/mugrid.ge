const ABOUT_BLOCKS = [
  {
    label: 'Background',
    text: 'Grew up in London. Studied Computer Science & Design at UCL, where I spent too much time in the library reading design manifestos and not enough time sleeping.',
  },
  {
    label: 'Past',
    text: 'Started at small startups where I wore every hat — research, design, a little frontend. Moved to larger companies to learn what craft at scale really means.',
  },
  {
    label: 'Present',
    text: 'Working at Anthropic on interfaces for AI products. Thinking about how design changes when the content is dynamic, uncertain, and collaborative.',
  },
  {
    label: 'Future',
    text: 'Build something of my own. Explore the intersection of AI and creative tools. Make things that help people think more clearly.',
  },
  {
    label: 'Hobbies',
    text: 'Running long distances. Hunting for good coffee. Vintage synthesisers. Cooking elaborate meals on Sunday evenings.',
  },
]

const TIMELINE = [
  {
    company: 'Anthropic',
    role: 'Product Designer',
    description: 'AI interfaces at the frontier',
    period: '2024 – Present',
    current: true,
  },
  {
    company: 'Linear',
    role: 'Product Designer',
    description: 'Tools for software teams',
    period: '2022 – 2024',
  },
  {
    company: 'Stripe',
    role: 'Design Engineer',
    description: 'Developer financial products',
    period: '2020 – 2022',
  },
  {
    company: 'UCL',
    role: 'BSc Computer Science & Design',
    description: 'First Class Honours',
    period: '2016 – 2020',
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
        <div className="space-y-0">
          {TIMELINE.map((item, i) => (
            <div key={item.company} className="flex gap-4">
              {/* Line + dot column */}
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
              <div className={`flex-1 pb-6 ${i === TIMELINE.length - 1 ? 'pb-0' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-[#0A0A0A]">{item.company}</p>
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
                    <p className="text-xs text-[#ABABAB] mt-0.5">{item.description}</p>
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

    </div>
  )
}
