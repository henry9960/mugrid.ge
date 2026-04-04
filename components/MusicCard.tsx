'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface FloatingNote {
  id:       number
  symbol:   string
  x:        string   // CSS left or right value
  y:        string   // CSS top or bottom value
  fromRight: boolean
  fromTop:   boolean
  drift:    number   // px horizontal drift
  size:     number   // px font size
  duration: number   // ms
  color:    string
}

// ── Track library — place files in /public/music/ ─────────────────────────────
// albumArtUrl: e.g. '/music/art/after-hours.jpg' (null = gradient placeholder)
// src:         e.g. '/music/blinding-lights.mp3'
const TRACKS = [
  {
    title:       'Home Run',
    artist:      'The Man The Myth The Meatslab',
    album:       'Home Run',
    albumArtUrl: '/music/art/Home Run cover.jpg' as string | null,
    src:         '/music/The Man The Myth The Meatslab - Home Run (SPOTISAVER).mp3',
    startTime:   20,   // ← seconds to start playback from (e.g. 30 = start at 0:30)
  },
  
  {
    title:       'Blue Spring',
    artist:      'Nathan Micay',
    album:       'Blue Spring',
    albumArtUrl: '/music/art/Blue Spring cover.jpg' as string | null,
    src:         '/music/Nathan Micay - Blue Spring (SPOTISAVER).mp3',
    startTime:   0,   // ← seconds to start playback from (e.g. 30 = start at 0:30)
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

const SYMBOLS = ['♪', '♫', '♩', '♬']
let noteUid = 0

export default function MusicCard() {
  const [trackIdx,     setTrackIdx]     = useState(0)
  const [isPlaying,    setIsPlaying]    = useState(false)
  const [currentTime,  setCurrentTime]  = useState(0)
  const [duration,     setDuration]     = useState(0)
  const [notes,        setNotes]        = useState<FloatingNote[]>([])
  const audioRef    = useRef<HTMLAudioElement | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const track = TRACKS[trackIdx]

  // Rebuild audio element whenever the track changes
  useEffect(() => {
    const audio = new Audio(track.src)
    audioRef.current = audio

    const onTime     = () => setCurrentTime(audio.currentTime)
    const onMeta     = () => {
      setDuration(audio.duration)
      if (track.startTime > 0) {
        audio.currentTime = track.startTime
        setCurrentTime(track.startTime)
      }
    }
    const onEnded    = () => { setIsPlaying(false); setCurrentTime(track.startTime ?? 0) }

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

  // Spawn floating music notes while playing
  useEffect(() => {
    if (!isPlaying) { setNotes([]); return }

    function spawn() {
      const id       = noteUid++
      const symbol   = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      const duration = 2000 + Math.random() * 1200
      const drift    = (Math.random() - 0.5) * 44
      const size     = 10 + Math.random() * 8
      const color    = Math.random() > 0.45 ? '#1DB954' : 'rgba(255,255,255,0.65)'

      // Pick an edge: bottom (most common), left, right, top (rare)
      const roll = Math.random()
      let note: FloatingNote
      if (roll < 0.50) {                                          // bottom
        note = { id, symbol, duration, drift, size, color, fromRight: false, fromTop: false, x: `${8 + Math.random() * 84}%`, y: '8%' }
      } else if (roll < 0.75) {                                   // left
        note = { id, symbol, duration, drift, size, color, fromRight: false, fromTop: true,  x: '6%',                          y: `${15 + Math.random() * 65}%` }
      } else if (roll < 0.92) {                                   // right
        note = { id, symbol, duration, drift, size, color, fromRight: true,  fromTop: true,  x: '6%',                          y: `${15 + Math.random() * 65}%` }
      } else {                                                     // top
        note = { id, symbol, duration, drift, size, color, fromRight: false, fromTop: true,  x: `${8 + Math.random() * 84}%`, y: '6%' }
      }

      setNotes(prev => [...prev, note])
      setTimeout(() => setNotes(prev => prev.filter(n => n.id !== id)), duration + 50)
    }

    spawn()
    const iv = setInterval(spawn, 650)
    return () => { clearInterval(iv); setNotes([]) }
  }, [isPlaying])

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
    const prev = (trackIdx - 1 + TRACKS.length) % TRACKS.length
    setCurrentTime(TRACKS[prev].startTime ?? 0)
    setTrackIdx(prev)
  }, [trackIdx])

  const nextTrack = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
    const next = (trackIdx + 1) % TRACKS.length
    setCurrentTime(TRACKS[next].startTime ?? 0)
    setTrackIdx(next)
  }, [trackIdx])

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
    <>
    <style>{`
      @keyframes eq {
        0%, 100% { transform: scaleY(0.3); }
        50%       { transform: scaleY(1);   }
      }
      @keyframes float-note {
        0%   { transform: translateY(0px)   translateX(0px)               scale(1);    opacity: 0.9; }
        15%  { opacity: 0.9; }
        100% { transform: translateY(-70px) translateX(var(--note-drift))  scale(0.65); opacity: 0; }
      }
    `}</style>
    <div className="relative rounded-3xl">
      {/* ── Floating notes ───────────────────────────────── */}
      {notes.map(n => (
        <span
          key={n.id}
          className="absolute pointer-events-none select-none"
          style={{
            [n.fromRight ? 'right' : 'left']: n.x,
            [n.fromTop   ? 'top'  : 'bottom']: n.y,
            fontSize:  `${n.size}px`,
            color:     n.color,
            zIndex:    40,
            lineHeight: 1,
            animation: `float-note ${n.duration}ms ease-out forwards`,
            '--note-drift': `${n.drift}px`,
          } as React.CSSProperties}
        >
          {n.symbol}
        </span>
      ))}
    <div
      className="aspect-square rounded-3xl overflow-hidden relative isolate"
      style={{
        transform:  'translateZ(0)',
        boxShadow:  'inset 0 0 0 1px rgba(255,255,255,0.1), 0 1px 3px rgba(0,0,0,0.2)',
      }}
    >

      {/* ── Album art / placeholder background ───────────── */}
      {track.albumArtUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={track.albumArtUrl}
          alt={`${track.album} cover`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0f1923 0%, #1a1040 45%, #0d2137 100%)' }}
        />
      )}

      {/* ── Gradient scrim ───────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.08) 75%, transparent 100%)' }}
      />

      {/* ── Top label ────────────────────────────────────── */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <p
          className="text-[9px] font-semibold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          Music
        </p>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>
          <IconMusic />
        </span>
      </div>

      {/* ── Bottom overlay: info + progress + controls ───── */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2.5">

        {/* Track info */}
        <div className="flex items-end justify-between gap-2">
          <a
            href="https://open.spotify.com/user/638knp49o0si9u4tc3wcbuikr?si=4511488aa651476a"
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 group"
          >
            <p className="text-sm font-semibold leading-snug truncate text-white group-hover:underline">
              {track.title}
            </p>
            <p className="text-[11px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {track.artist}
            </p>
          </a>
          <EqBars playing={isPlaying} />
        </div>

        {/* Progress */}
        <div className="flex flex-col gap-1">
          <div
            ref={progressRef}
            className="w-full h-[3px] rounded-full cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
            onClick={handleProgressClick}
          >
            <div
              className="h-full rounded-full pointer-events-none"
              style={{ width: `${pct}%`, backgroundColor: '#1DB954' }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] tabular-nums" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {fmt(currentTime)}
            </span>
            <span className="text-[9px] tabular-nums" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {fmt(duration)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={prevTrack}
            className="transition-colors duration-150 cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.45)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            aria-label="Previous track"
          >
            <IconPrev />
          </button>

          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#1DB954', color: '#000' }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>

          <button
            onClick={nextTrack}
            className="transition-colors duration-150 cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.45)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            aria-label="Next track"
          >
            <IconNext />
          </button>
        </div>

      </div>
    </div>
    </div>
    </>
  )
}
