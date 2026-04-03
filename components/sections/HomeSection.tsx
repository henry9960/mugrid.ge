const EXPERIENCES = [
  {
    company: 'Microsoft',
    role: 'Product Manager Intern',
    description: 'Working on AI products.',
    period: 'Summer 2026',
    current: true,
  },
]

const NOW_ITEMS = [
  { label: 'Learning', value: 'Vibecoding and using Claude!' },
  { label: 'Reading', value: 'wip' },
  { label: 'Listening to', value: 'wip' },
  { label: 'Location', value: 'London, UK' },
]

function Divider() {
  return <hr className="border-t border-[#E4E4E8] my-3" />
}

export default function HomeSection() {
  return (
    <div className="grid grid-cols-12 gap-4 items-start">

      {/* ── Primary card ─────────────────────────────── */}
      <div className="col-span-12 md:col-span-7 bg-[#F7F7F9] rounded-3xl p-8 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#ABABAB] mb-3">
                Hi there, I&apos;m...
              </p>
              <h1 className="text-[52px] font-semibold text-[#0A0A0A] leading-none tracking-tight">
                Harry Mugridge
              </h1>
              <p className="text-lg text-[#8A8A8A] font-light mt-2">
                Product Manager &amp; Student
              </p>
            </div>
            {/* Avatar placeholder */}
            <div className="w-14 h-14 rounded-full bg-[#E4E4E8] flex-shrink-0 mt-1" />
          </div>

          <Divider />

          <p className="text-[15px] text-[#6B6B6B] leading-relaxed">
            WIP text goes here
          </p>
          <p className="text-[15px] text-[#6B6B6B] leading-relaxed mt-4">
            WIP text goes here
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
          <span className="text-xs text-[#ABABAB]">London, United Kingdom</span>
        </div>
      </div>

      {/* ── Right side: 2×2 square grid ──────────────── */}
      <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-4">

        {/* Experience */}
        <div className="bg-[#F7F7F9] rounded-3xl p-5 aspect-square flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#0A0A0A]">Experience</h2>
            <Divider />
            <div className="space-y-3">
              {EXPERIENCES.map((exp) => (
                <div key={exp.company}>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-semibold text-[#0A0A0A]">{exp.company}</p>
                    {exp.current && (
                      <span
                        className="text-[9px] font-semibold rounded-full px-1.5 py-0.5"
                        style={{ color: '#3A7D44', backgroundColor: '#EDFAF1' }}
                      >
                        Now
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#8A8A8A] mt-0.5">{exp.role}</p>
                  <p className="text-[10px] text-[#ABABAB] mt-0.5">{exp.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Now */}
        <div className="bg-[#F7F7F9] rounded-3xl p-5 aspect-square flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#0A0A0A]">Now</h2>
            <Divider />
            <div className="space-y-2">
              {NOW_ITEMS.map((item) => (
                <div key={item.label}>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-[#ABABAB]">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-[#0A0A0A] mt-0.5 leading-snug">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Music */}
        <div className="bg-[#F7F7F9] rounded-3xl p-5 aspect-square flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-[#ABABAB]">Music</p>
            <span className="text-[10px] font-medium text-[#ABABAB] bg-[#EDEDED] rounded-full px-2 py-0.5">
              Soon
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-[#D0D0D4]">Music player</p>
          </div>
          <div className="h-8 rounded-xl border border-dashed border-[#E4E4E8]" />
        </div>

        {/* Gallery */}
        <div className="bg-[#F7F7F9] rounded-3xl p-5 aspect-square flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-[#ABABAB]">Gallery</p>
            <span className="text-[10px] font-medium text-[#ABABAB] bg-[#EDEDED] rounded-full px-2 py-0.5">
              Soon
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-[#D0D0D4]">Visual gallery</p>
          </div>
          <div className="h-8 rounded-xl border border-dashed border-[#E4E4E8]" />
        </div>

      </div>
    </div>
  )
}
