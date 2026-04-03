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

      {/* ── Right side grid ───────────────────────────── */}
      <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-4">

        {/* Currently — spans full width */}
        <div className="col-span-2 bg-[#F7F7F9] rounded-3xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#0A0A0A]">Currently</h2>
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold rounded-full px-2 py-1"
              style={{ color: '#3A7D44', backgroundColor: '#EDFAF1' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3A7D44] inline-block" />
              Now
            </span>
          </div>

          <Divider />

          {/* Microsoft internship — hero */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-[#0A0A0A] leading-none">Microsoft</p>
              <p className="text-sm text-[#6B6B6B] mt-1">Product Manager Intern</p>
              <p className="text-xs text-[#ABABAB] mt-0.5">Summer 2026</p>
            </div>
            {/* Microsoft logo mark */}
            <div className="grid grid-cols-2 gap-[3px] flex-shrink-0">
              <div className="w-5 h-5 rounded-[3px]" style={{ backgroundColor: '#F25022' }} />
              <div className="w-5 h-5 rounded-[3px]" style={{ backgroundColor: '#7FBA00' }} />
              <div className="w-5 h-5 rounded-[3px]" style={{ backgroundColor: '#00A4EF' }} />
              <div className="w-5 h-5 rounded-[3px]" style={{ backgroundColor: '#FFB900' }} />
            </div>
          </div>

          <Divider />

          {/* Meta row */}
          <div className="flex gap-6">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-[#ABABAB] mb-0.5">Learning</p>
              <p className="text-xs text-[#0A0A0A]">Vibecoding and using Claude!</p>
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-[#ABABAB] mb-0.5">Location</p>
              <p className="text-xs text-[#0A0A0A]">London, UK</p>
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
