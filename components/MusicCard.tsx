'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// ── Track library — place files in /public/music/ ─────────────────────────────
// albumArtUrl: e.g. '/music/art/after-hours.jpg' (null = gradient placeholder)
// src:         e.g. '/music/blinding-lights.mp3'
const TRACKS = [
  {
    title:       'Blinding Lights',
    artist:      'The Weeknd',
    album:       'After Hours',
    albumArtUrl: null as string | null,
    src:         '/music/blinding-lights.mp3',
  },
]
// ─────────────────────────────────────────────────────────────────────────────

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return '0:00'
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

function IconPrev() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
    </svg>
  )
}

function IconNext() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zm10-12v12h2V6h-2z" />
    </svg>
  )
}

function IconPlay() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function IconPause() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

function IconMusic() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    </svg>
  )
}

// Three-bar equaliser that animates when playing
function EqBars({ playing }: { playing: boolean }) {
  const bars = [
    { delay: '0ms',   maxH: 10 },
    { delay: '200ms', maxH: 14 },
    { delay: '100ms', maxH: 8  },
  ]
  return (
    <>
      <style>{`
        @keyframes eq {
          0%, 100% { transform: scaleY(0.3); }
          50%       { transform: scaleY(1);   }
        }
      `}</style>
      <span className="flex items-end gap-[2px] h-4 flex-shrink-0">
        {bars.map((b, i) => (
          <span
            key={i}
            className="w-[2.5px] rounded-full origin-bottom"
            style={{
              height:          `${b.maxH}px`,
              backgroundColor: '#1DB954',
              animation:       playing
                ? `eq 700ms ${b.delay} ease-in-out infinite`
                : undefined,
              transform:       playing ? undefined : 'scaleY(0.3)',
              transition:      'transform 200ms ease',
            }}
          />
        ))}
      </span>
    </>
  )
}

export default function MusicCard() {
  const [trackIdx,     setTrackIdx]     = useState(0)
  const [isPlaying,    setIsPlaying]    = useState(false)
  const [currentTime,  setCurrentTime]  = useState(0)
  const [duration,     setDuration]     = useState(0)
  const audioRef    = useRef<HTMLAudioElement | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const track = TRACKS[trackIdx]

  // Rebuild audio element whenever the track changes
  useEffect(() => {
    const audio = new Audio(track.src)
    audioRef.current = audio

    const onTime     = () => setCurrentTime(audio.currentTime)
    const onMeta     = () => setDuration(audio.duration)
    const onEnded    = () => { setIsPlaying(false); setCurrentTime(0) }

    audio.addEventListener('timeupdate',     onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended',          onEnded)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate',     onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended',          onEnded)
    }
  }, [trackIdx, track.src])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [isPlaying])

  const prevTrack = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
    setCurrentTime(0)
    setTrackIdx(i => (i - 1 + TRACKS.length) % TRACKS.length)
  }, [])

  const nextTrack = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
    setCurrentTime(0)
    setTrackIdx(i => (i + 1) % TRACKS.length)
  }, [])

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = pct * duration
    setCurrentTime(pct * duration)
  }, [duration])

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className="aspect-square rounded-3xl p-5 flex flex-col gap-2 overflow-hidden"
      style={{ backgroundColor: '#111111' }}
    >
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-shrink-0">
        <p
          className="text-[9px] font-semibold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          Music
        </p>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>
          <IconMusic />
        </span>
      </div>

      {/* ── Album Art ────────────────────────────────────── */}
      <div className="flex-1 min-h-0 w-full rounded-xl overflow-hidden">
        {track.albumArtUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={track.albumArtUrl}
            alt={`${track.album} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #0f1923 0%, #1a1040 45%, #0d2137 100%)',
            }}
          >
            <svg
              width="28" height="28" viewBox="0 0 24 24" fill="none"
              style={{ color: 'rgba(255,255,255,0.08)' }}
            >
              <path
                d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* ── Track Info ───────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 flex-shrink-0">
        <div className="min-w-0">
          <p
            className="text-sm font-semibold leading-snug truncate"
            style={{ color: '#FFFFFF' }}
          >
            {track.title}
          </p>
          <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {track.artist}
          </p>
        </div>
        <EqBars playing={isPlaying} />
      </div>

      {/* ── Progress Bar ─────────────────────────────────── */}
      <div className="flex flex-col gap-1 flex-shrink-0">
        <div
          ref={progressRef}
          className="w-full h-[3px] rounded-full cursor-pointer group relative"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          onClick={handleProgressClick}
        >
          <div
            className="h-full rounded-full pointer-events-none"
            style={{ width: `${pct}%`, backgroundColor: '#1DB954' }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span
            className="text-[9px] tabular-nums"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            {fmt(currentTime)}
          </span>
          <span
            className="text-[9px] tabular-nums"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            {fmt(duration)}
          </span>
        </div>
      </div>

      {/* ── Controls ─────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-5 flex-shrink-0">
        <button
          onClick={prevTrack}
          className="transition-colors duration-150 cursor-pointer"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
          aria-label="Previous track"
        >
          <IconPrev />
        </button>

        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95"
          style={{ backgroundColor: '#1DB954', color: '#000' }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <IconPause /> : <IconPlay />}
        </button>

        <button
          onClick={nextTrack}
          className="transition-colors duration-150 cursor-pointer"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
          aria-label="Next track"
        >
          <IconNext />
        </button>
      </div>
    </div>
  )
}
