import WhatImUpToCard from '@/components/WhatImUpToCard'
import MusicCard from '@/components/MusicCard'

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
                Product Manager &amp; Student at Royal Holloway
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-[#E4E4E8] flex-shrink-0 mt-1" />
          </div>

          <Divider />

          <p className="text-[15px] text-[#6B6B6B] leading-relaxed">
            Hey, I&apos;m Harry, I&apos;m a Product Manager who&apos;s background spans product and strategy roles across Microsoft and Amazon where I&apos;ve worked on the customer experience, growth and operations.
          </p>
          <p className="text-[15px] text-[#6B6B6B] leading-relaxed mt-4">
            In addition to that, I am also currently a student at Royal Holloway, University of London studying Business and Management.
          </p>
          <p className="text-[15px] text-[#6B6B6B] leading-relaxed mt-4">
            Scroll down below to learn more about me!
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

        <WhatImUpToCard />

        <MusicCard />

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
