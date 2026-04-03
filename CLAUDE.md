# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Static export to ./out (required for GitHub Pages)
npm run lint     # ESLint via Next.js
```

No test suite is configured.

## Deployment

The site deploys to GitHub Pages (`harry.mugrid.ge`) via `.github/workflows/deploy.yml` on every push to `main`. The workflow builds with `npm ci && npm run build` and uploads `./out`. Because `output: 'export'` is set in `next.config.ts`, this is a fully static export — no server-side features (API routes, middleware, `next/image` optimisation) are available.

## Architecture

Single-page portfolio. `app/page.tsx` is the only route — it is a server component that composes four scroll-target sections inside a 1200px centred container. Section `id` attributes (`home`, `about`, `blog`, `contact`) are what the navbar scrolls to.

```
app/
  layout.tsx          # DM Sans font (next/font/google), global metadata
  globals.css         # CSS variables, scrollbar, @keyframes (gradient-drift, ripple-out)
  page.tsx            # Single route: Navbar + four sections

components/
  Navbar.tsx          # 'use client' — floating pill, scroll-spy via window scroll listener,
                      #   Framer Motion layoutId sliding indicator
  WhatImUpToCard.tsx  # 'use client' — the emerald gradient card with mouse-tracking glow
                      #   and dual concentric ripple rings (spawned on mousemove, throttled)
  sections/
    HomeSection.tsx   # Server component — 12-col bento grid; imports WhatImUpToCard
    AboutSection.tsx  # Server component — 7/5 col split: about blocks + vertical timeline
    BlogSection.tsx   # Server component — blurred placeholder cards with "Coming Soon" overlay
    ContactSection.tsx# 'use client' — platform cards (hover → brand colour), email card
                      #   (copy-to-clipboard + mailto), GitHub "Soon" card
```

## Design System

**Colours** — white page (`#FFFFFF`), cards `#F7F7F9`. Tailwind tokens: `bg-card`, `bg-canvas`. Raw hex values are used inline when needed. Accent colours only appear on interactive elements (hover states, the emerald card).

**Grid** — 12-column (`grid-cols-12`) with `gap-4` (16px). All layout uses column spans; no arbitrary positioning.

**Spacing** — 8pt scale. Prefer Tailwind's default scale (p-4 = 16px, p-6 = 24px, p-8 = 32px).

**Cards** — `bg-[#F7F7F9] rounded-3xl` (24px radius). Non-interactive cards have no hover state. Interactive cards use inline `onMouseEnter`/`onMouseLeave` with `transition` on the style prop rather than Tailwind hover variants, because several use dynamic inline styles.

**Framer Motion** is used in exactly two places: the navbar sliding pill (`layoutId="nav-pill"`) and the email compose form expand/collapse (`AnimatePresence` + `motion.div` height animation). Do not add Framer Motion elsewhere unless there is a strong reason.

**`'use client'` boundary** — only components that need browser APIs (scroll listener, clipboard, mouse events) are client components. Keep server components as the default.

## Content Placeholders

Several fields are intentionally left as "WIP" and are ready to be filled in:
- Bio paragraphs in `HomeSection.tsx` (primary card)
- One-liner description in `WhatImUpToCard.tsx`
- About blocks (`ABOUT_BLOCKS` array) in `AboutSection.tsx`
