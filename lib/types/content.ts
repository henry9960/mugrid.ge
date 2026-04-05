export interface HomeContent {
  name: string
  tagline: string
  /** Multi-paragraph bio — split on \n\n for rendering */
  bio: string
  /** Short custom "now" status shown at the bottom of the hero card */
  nowStatus: string
}

export interface AboutBlock {
  id: string
  label: string
  text: string
}

export type TimelineState = 'active' | 'highlighted' | 'inactive'

export interface TimelineEntry {
  id: string
  company: string
  role: string
  description: string
  period: string
  state: TimelineState
  badgeLabel?: string
  detail?: string
  href?: string
  accentColor?: string
  /** Extra fields used when state === 'active' to populate the What I'm up to card */
  learning?: string
  location?: string
  logoUrl?: string | null
}

export interface AboutContent {
  sectionHeading: string
  blocks: AboutBlock[]
  location: string
  timeline: TimelineEntry[]
}

export interface SocialLink {
  id: string
  platform: string
  handle: string
  url: string
  enabled: boolean
}

export interface ContactContent {
  sectionHeading: string
  email: string
  socials: SocialLink[]
}

export interface ThoughtsContent {
  sectionHeading: string
}

export interface MusicTrack {
  title: string
  artist: string
  album: string
  albumArtUrl: string | null
  src: string
  startTime: number
}

export interface MusicContent {
  tracks: MusicTrack[]
}

export interface GalleryPhoto {
  src: string
  caption?: string
}

export interface GalleryContent {
  photos: GalleryPhoto[]
}
