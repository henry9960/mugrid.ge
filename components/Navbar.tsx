'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { id: 'home',    label: 'Home' },
  { id: 'about',   label: 'About' },
  { id: 'blog',    label: 'Blog' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()
  const isHome   = pathname === '/'

  const [active,  setActive]  = useState('home')
  const [hovered, setHovered] = useState<string | null>(null)

  const displayed = hovered ?? active

  // Scroll-spy — only on home page
  useEffect(() => {
    if (!isHome) {
      if (pathname.startsWith('/blog')) setActive('blog')
      else setActive('home')
      return
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      const atBottom = scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10
      const threshold = atBottom
        ? scrollY + window.innerHeight
        : scrollY + window.innerHeight * 0.35

      for (const { id } of [...NAV_ITEMS].reverse()) {
        const el = document.getElementById(id)
        if (el) {
          const elTop = el.getBoundingClientRect().top + scrollY
          if (elTop <= threshold) { setActive(id); break }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome, pathname])

  const handleClick = (id: string) => {
    if (!isHome) {
      router.push(`/#${id}`)
      return
    }
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setActive(id)
  }

  return (
    <div className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
      <nav
        className="pointer-events-auto flex items-center gap-0.5 rounded-full p-1.5"
        style={{
          backgroundColor: 'rgba(247,247,249,0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 1px 0 0 rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.07)',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {NAV_ITEMS.map(({ id, label }) => (
          <motion.button
            key={id}
            onClick={() => handleClick(id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="relative px-4 py-1.5 rounded-full text-sm outline-none focus-visible:ring-2 focus-visible:ring-black/10"
          >
            {displayed === id && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full bg-white"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                transition={{ type: 'spring', bounce: 0.12, duration: 0.28 }}
              />
            )}
            <span
              className="relative z-10 font-medium transition-colors duration-150"
              style={{ color: displayed === id ? '#0A0A0A' : '#8A8A8A' }}
            >
              {label}
            </span>
          </motion.button>
        ))}

        {/* Divider */}
        <div style={{ width: 1, height: 16, backgroundColor: 'rgba(0,0,0,0.1)', margin: '0 3px', flexShrink: 0 }} />

        {/* CV link */}
        <motion.a
          href="/cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered('__cv__')}
          onMouseLeave={() => setHovered(null)}
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="relative px-3.5 py-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-black/10"
          aria-label="View CV"
        >
          {displayed === '__cv__' && (
            <motion.span
              layoutId="nav-pill"
              className="absolute inset-0 rounded-full bg-white"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
              transition={{ type: 'spring', bounce: 0.12, duration: 0.28 }}
            />
          )}
          <span
            className="relative z-10 flex items-center justify-center transition-colors duration-150"
            style={{ color: displayed === '__cv__' ? '#0A0A0A' : '#8A8A8A' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="8" y1="13" x2="16" y2="13"/>
              <line x1="8" y1="17" x2="12" y2="17"/>
            </svg>
          </span>
        </motion.a>
      </nav>
    </div>
  )
}
