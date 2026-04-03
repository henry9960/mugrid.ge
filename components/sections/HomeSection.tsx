const EXPERIENCES = [
  {
    company: 'Anthropic',
    role: 'Product Designer',
    description: 'Shaping interfaces at the frontier of AI.',
    period: '2024 – Present',
    current: true,
  },
  {
    company: 'Linear',
    role: 'Product Designer',
    description: 'Tooling for high-velocity software teams.',
    period: '2022 – 2024',
  },
  {
    company: 'Stripe',
    role: 'Design Engineer',
    description: 'Developer-facing financial products.',
    period: '2020 – 2022',
  },
]

const NOW_ITEMS = [
  { label: 'Working on', value: 'Design systems for LLM interfaces' },
  { label: 'Reading', value: 'The Shape of Design — Frank Chimero' },
  { label: 'Listening to', value: 'Floating Points, Burial, Four Tet' },
  { label: 'Location', value: 'London, UK' },
]

function Divider() {
  return <hr className="border-t border-[#E4E4E8] my-4" />
}

export default function HomeSection() {
  return (
    <div className="grid grid-cols-12 gap-4">

      {/* ── Primary card ─────────────────────────────── */}
      <div
        className="col-span-12 md:col-span-7 md:row-span-2 bg-[#F7F7F9] rounded-3xl p-8 flex flex-col justify-between"
        style={{ minHeight: '320px' }}
      >
        <div>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#ABABAB] mb-3">
                Portfolio
              </p>
              <h1 className="text-[52px] font-semibold text-[#0A0A0A] leading-none tracking-tight">
                Henry
              </h1>
              <p className="text-lg text-[#8A8A8A] font-light mt-2">
                Product Designer &amp; Builder
              </p>
            </div>
            {/* Avatar placeholder */}
            <div className="w-14 h-14 rounded-full bg-[#E4E4E8] flex-shrink-0 mt-1" />
          </div>

          <Divider />

          <p className="text-[15px] text-[#6B6B6B] leading-relaxed">
            I build products that live at the intersection of design and engineering.
            With a background in systems thinking and interaction design, I focus on
            creating tools that feel inevitable — interfaces that get out of the way
            and let people think clearly.
          </p>
          <p className="text-[15px] text-[#6B6B6B] leading-relaxed mt-4">
            Previously at Stripe and Linear. Currently exploring what great design
            looks like in the age of AI at Anthropic.
          </p>
        </div>

        <div className="mt-8 flex items-center gap-3 flex-wrap">
          <span
            className="inline-flex items-center gap-2 text-xs font-medium text-[#3A7D44] rounded-full px-3 py-1.5"
            style={{ backgroundColor: '#EDFAF1' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#3A7D44] inline-block" />
            Available for select projects
          </span>
          <span className="text-xs text-[#ABABAB]">London, UK</span>
        </div>
      </div>

      {/* ── Experience card ───────────────────────────── */}
      <div className="col-span-12 md:col-span-5 bg-[#F7F7F9] rounded-3xl p-6">
        <h2 className="text-2xl font-semibold text-[#0A0A0A]">Experience</h2>
        <Divider />
        <div className="space-y-5">
          {EXPERIENCES.map((exp) => (
            <div key={exp.company} className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#0A0A0A]">{exp.company}</p>
                  {exp.current && (
                    <span
                      className="text-[10px] font-semibold rounded-full px-1.5 py-0.5"
                      style={{ color: '#3A7D44', backgroundColor: '#EDFAF1' }}
                    >
                      Now
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8A8A8A] mt-0.5">{exp.role}</p>
                <p className="text-xs text-[#ABABAB] mt-1 leading-relaxed">{exp.description}</p>
              </div>
              <span className="text-xs text-[#ABABAB] whitespace-nowrap ml-4 mt-0.5 flex-shrink-0">
                {exp.period}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Now card ──────────────────────────────────── */}
      <div className="col-span-12 md:col-span-5 bg-[#F7F7F9] rounded-3xl p-6">
        <h2 className="text-2xl font-semibold text-[#0A0A0A]">Now</h2>
        <Divider />
        <div className="space-y-3">
          {NOW_ITEMS.map((item) => (
            <div key={item.label} className="flex gap-3">
              <span className="text-xs text-[#ABABAB] w-24 flex-shrink-0 pt-px leading-relaxed">
                {item.label}
              </span>
              <span className="text-xs text-[#0A0A0A] leading-relaxed">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tertiary: Music placeholder ───────────────── */}
      <div className="col-span-12 md:col-span-4 bg-[#F7F7F9] rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium uppercase tracking-widest text-[#ABABAB]">Music</p>
          <span className="text-[10px] font-medium text-[#ABABAB] bg-[#EDEDED] rounded-full px-2.5 py-1">
            Soon
          </span>
        </div>
        <div className="h-16 flex items-center justify-center rounded-2xl border border-dashed border-[#E4E4E8]">
          <p className="text-xs text-[#D0D0D4]">Music player</p>
        </div>
      </div>

      {/* ── Tertiary: Gallery placeholder ─────────────── */}
      <div className="col-span-12 md:col-span-8 bg-[#F7F7F9] rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium uppercase tracking-widest text-[#ABABAB]">Gallery</p>
          <span className="text-[10px] font-medium text-[#ABABAB] bg-[#EDEDED] rounded-full px-2.5 py-1">
            Soon
          </span>
        </div>
        <div className="h-16 flex items-center justify-center rounded-2xl border border-dashed border-[#E4E4E8]">
          <p className="text-xs text-[#D0D0D4]">Visual gallery</p>
        </div>
      </div>

    </div>
  )
}
