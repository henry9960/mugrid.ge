'use client'

import { useEffect, useState, useRef } from 'react'

const COLORS = ['#FFD700', '#FFC107', '#F59E0B', '#FBBF24', '#ffffff', '#FDE68A', '#FFECB3']

interface Sparkle {
  id:       number
  x:        number   // % relative to container
  y:        number
  size:     number
  color:    string
  duration: number
}

let uid = 0

function SparkleEl({ x, y, size, color, duration }: Omit<Sparkle, 'id'>) {
  return (
    <span
      aria-hidden
      style={{
        position:  'absolute',
        left:      `${x}%`,
        top:       `${y}%`,
        width:     size,
        height:    size,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex:    20,
        animation: `sparkle-pop ${duration}ms ease-out forwards`,
        color,
      }}
    >
      {/* 4-pointed star */}
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M12 1 L13.8 9.8 L22.5 12 L13.8 14.2 L12 23 L10.2 14.2 L1.5 12 L10.2 9.8 Z" />
      </svg>
    </span>
  )
}

export default function SparklyName({ children, className }: { children: React.ReactNode; className?: string }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const spawn = () => {
    const sparkle: Sparkle = {
      id:       uid++,
      x:        5 + Math.random() * 90,
      y:        -15 + Math.random() * 130,
      size:     8 + Math.random() * 14,
      color:    COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 500 + Math.random() * 400,
    }
    setSparkles(prev => [...prev, sparkle])
    const t = setTimeout(
      () => setSparkles(prev => prev.filter(s => s.id !== sparkle.id)),
      sparkle.duration + 50,
    )
    timersRef.current.push(t)
  }

  useEffect(() => {
    // ── Initial burst: ~28 sparkles over 2.2s ──
    let count = 0
    const burst = () => {
      spawn()
      count++
      if (count < 28) {
        const t = setTimeout(burst, 70 + Math.random() * 40)
        timersRef.current.push(t)
      }
    }
    burst()

    // ── Occasional: 1 sparkle every 2–4s after burst ──
    let occasionalTimer: ReturnType<typeof setTimeout>
    const scheduleOccasional = () => {
      occasionalTimer = setTimeout(() => {
        spawn()
        scheduleOccasional()
      }, 2000 + Math.random() * 2500)
      timersRef.current.push(occasionalTimer)
    }
    const startT = setTimeout(scheduleOccasional, 2500)
    timersRef.current.push(startT)

    return () => timersRef.current.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <style>{`
        @keyframes sparkle-pop {
          0%   { opacity: 0; transform: translate(-50%,-50%) scale(0) rotate(0deg); }
          25%  { opacity: 1; transform: translate(-50%,-50%) scale(1.1) rotate(50deg); }
          70%  { opacity: 0.9; transform: translate(-50%,-50%) scale(0.85) rotate(100deg); }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(0) rotate(140deg); }
        }
      `}</style>
      <span className={`relative inline-block ${className ?? ''}`}>
        {sparkles.map(s => <SparkleEl key={s.id} {...s} />)}
        {children}
      </span>
    </>
  )
}
