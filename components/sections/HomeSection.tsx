import WhatImUpToCard from '@/components/WhatImUpToCard'
import MusicCard from '@/components/MusicCard'
import GalleryCard from '@/components/GalleryCard'
import SparklyName from '@/components/SparklyName'
import type { HomeContent, MusicContent, GalleryContent, TimelineEntry } from '@/lib/types/content'

function Divider() {
  return <hr className="border-t border-[#E4E4E8] my-3" />
}

interface HomeSectionProps {
  data: HomeContent
  music: MusicContent
  gallery: GalleryContent
  activeEntry: TimelineEntry | null
}

export default function HomeSection({ data, music, gallery, activeEntry }: HomeSectionProps) {
  const paragraphs = data.bio.split('\n\n').filter(Boolean)

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
                <SparklyName>{data.name}</SparklyName>
              </h1>
              <p className="text-lg text-[#8A8A8A] font-light mt-2">
                {data.tagline}
              </p>
            </div>
          </div>

          <Divider />

          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-[15px] text-[#6B6B6B] leading-relaxed"
              style={i > 0 ? { marginTop: '1rem' } : undefined}
            >
              {para}
            </p>
          ))}
        </div>

        {data.nowStatus && (
          <>
            <style>{`
              @keyframes now-aurora {
                0%, 100% { background-position: 0% 50%; }
                50%       { background-position: 100% 50%; }
              }
              @keyframes now-star {
                0%, 100% { transform: rotate(0deg)   scale(1);    opacity: 0.65; }
                50%       { transform: rotate(180deg) scale(1.2);  opacity: 1;    }
              }
            `}</style>
            <div className="mt-8">
              <span
                className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-4 py-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.10) 0%, rgba(99,102,241,0.08) 30%, rgba(59,130,246,0.10) 60%, rgba(16,185,129,0.07) 100%)',
                  backgroundSize: '300% 300%',
                  animation: 'now-aurora 7s ease infinite',
                  border: '1px solid rgba(139,92,246,0.18)',
                  color: '#4B4B6B',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '12px',
                    lineHeight: 1,
                    color: '#8B5CF6',
                    animation: 'now-star 4s ease-in-out infinite',
                  }}
                >
                  ✦
                </span>
                {data.nowStatus}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Right side grid ───────────────────────────── */}
      <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-4">

        {activeEntry && <WhatImUpToCard entry={activeEntry} />}

        <MusicCard tracks={music.tracks} />

        <GalleryCard photos={gallery.photos} />

      </div>
    </div>
  )
}
