'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

/* ── Icons ── */
const HomeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const AboutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)
const WritingIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
)
const ContactIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)
const MusicIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
  </svg>
)
const GalleryIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: 'transform 0.15s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
)

function NavLink({ href, label, icon, exact = false }: { href: string; label: string; icon: React.ReactNode; exact?: boolean }) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-150"
      style={{
        color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
        backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
      }}
      onMouseEnter={e => {
        if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)'
        ;(e.currentTarget as HTMLElement).style.color = isActive ? '#fff' : 'rgba(255,255,255,0.7)'
      }}
      onMouseLeave={e => {
        if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
        ;(e.currentTarget as HTMLElement).style.color = isActive ? '#fff' : 'rgba(255,255,255,0.45)'
      }}
    >
      <span style={{ color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.4)' }}>{icon}</span>
      {label}
    </Link>
  )
}

function SubLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(href)
  return (
    <Link
      href={href}
      className="flex items-center gap-2 pl-7 pr-2.5 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-150"
      style={{
        color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
        backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
      }}
      onMouseEnter={e => {
        if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)'
        ;(e.currentTarget as HTMLElement).style.color = isActive ? '#fff' : 'rgba(255,255,255,0.65)'
      }}
      onMouseLeave={e => {
        if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
        ;(e.currentTarget as HTMLElement).style.color = isActive ? '#fff' : 'rgba(255,255,255,0.4)'
      }}
    >
      <span style={{ color: isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)' }}>{icon}</span>
      {label}
    </Link>
  )
}

function GroupHeader({ label, icon, open, onClick, isActive }: {
  label: string; icon: React.ReactNode; open: boolean; onClick: () => void; isActive: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-150"
      style={{
        color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
        backgroundColor: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = isActive ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.05)'
        ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = isActive ? 'rgba(255,255,255,0.06)' : 'transparent'
        ;(e.currentTarget as HTMLElement).style.color = isActive ? '#fff' : 'rgba(255,255,255,0.45)'
      }}
    >
      <span style={{ color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.4)' }}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      <span style={{ color: 'rgba(255,255,255,0.25)' }}><ChevronIcon open={open} /></span>
    </button>
  )
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const homeActive = pathname.startsWith('/admin/home') || pathname.startsWith('/admin/music') || pathname.startsWith('/admin/gallery')
  const writingActive = pathname.startsWith('/admin/blog') || pathname.startsWith('/admin/thoughts')

  const [homeOpen, setHomeOpen] = useState(homeActive)
  const [writingOpen, setWritingOpen] = useState(writingActive)

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Logo */}
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">Admin</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>harry.mugrid.ge</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <p className="text-[9px] font-semibold uppercase tracking-widest px-2 mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Content
        </p>
        <div className="space-y-0.5">

          {/* Home group */}
          <GroupHeader
            label="Home"
            icon={<HomeIcon />}
            open={homeOpen}
            onClick={() => setHomeOpen(o => !o)}
            isActive={homeActive}
          />
          {homeOpen && (
            <div className="space-y-0.5 mt-0.5">
              <SubLink href="/admin/home" label="Content" icon={
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                </svg>
              } />
              <SubLink href="/admin/music" label="Music" icon={<MusicIcon />} />
              <SubLink href="/admin/gallery" label="Gallery" icon={<GalleryIcon />} />
            </div>
          )}

          {/* About */}
          <NavLink href="/admin/about" label="About" icon={<AboutIcon />} />

          {/* Writing group */}
          <GroupHeader
            label="Writing"
            icon={<WritingIcon />}
            open={writingOpen}
            onClick={() => setWritingOpen(o => !o)}
            isActive={writingActive}
          />
          {writingOpen && (
            <div className="space-y-0.5 mt-0.5">
              <SubLink href="/admin/thoughts" label="What I'm up to" icon={
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              } />
              <SubLink href="/admin/blog" label="Blog posts" icon={
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              } />
            </div>
          )}

          {/* Contact */}
          <NavLink href="/admin/contact" label="Contact" icon={<ContactIcon />} />

        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 pb-6">
        <hr className="border-white/10 mb-3" />
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-colors w-full"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
          View site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-colors w-full text-left mt-0.5"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  )
}
