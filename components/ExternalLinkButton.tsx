import Link from 'next/link'

interface Props {
  href: string
  external?: boolean
  /** Background colour of the circle */
  bg?: string
  /** Icon + hover-bg colour */
  color?: string
  hoverBg?: string
  /** Circle diameter in px (default 24) */
  size?: number
  onClick?: (e: React.MouseEvent) => void
  className?: string
}

/**
 * Standardised external/internal link icon — a small circle with a diagonal ↗ arrow.
 * Used consistently across the site wherever a card or row links to another page.
 */
export default function ExternalLinkButton({
  href,
  external = false,
  bg = 'rgba(0,0,0,0.06)',
  color = '#8A8A8A',
  hoverBg,
  size = 24,
  onClick,
  className = '',
}: Props) {
  const iconSize = Math.round(size * 0.42)

  const inner = (
    <span
      className={`flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-150 ${className}`}
      style={{ width: size, height: size, backgroundColor: bg, color }}
    >
      <svg
        width={iconSize} height={iconSize}
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </span>
  )

  const handleEnter = hoverBg
    ? (e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement>) => {
        const span = e.currentTarget.querySelector('span') ?? e.currentTarget as HTMLElement
        ;(span as HTMLElement).style.backgroundColor = hoverBg
      }
    : undefined

  const handleLeave = hoverBg
    ? (e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement>) => {
        const span = e.currentTarget.querySelector('span') ?? e.currentTarget as HTMLElement
        ;(span as HTMLElement).style.backgroundColor = bg
      }
    : undefined

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {inner}
      </a>
    )
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {inner}
    </Link>
  )
}
