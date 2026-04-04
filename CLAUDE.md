# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build (Next.js server mode, used by Vercel)
npm run lint     # ESLint via Next.js
```

No test suite is configured.

## Deployment

The site is hosted on **Vercel** at `harry.mugrid.ge`. Vercel auto-deploys on every push to `main` — no manual steps needed. There is no static export; the site runs as a full Next.js server on Vercel.

- `.github/workflows/deploy.yml` is a stub comment — GitHub Actions is not used.
- `next.config.ts` has no `output: 'export'` — standard Next.js server mode.
- Do NOT re-add `output: 'export'` — it breaks API routes and the admin CMS.

## Architecture

Portfolio site with a main single-page layout plus sub-pages. `app/page.tsx` is the primary route — a server component that composes four scroll-target sections inside a 1200px centred container. Section `id` attributes (`home`, `about`, `blog`, `contact`) are what the navbar scrolls to.

```
app/
  layout.tsx              # DM Sans font, global metadata (OG tags, Twitter card)
  globals.css             # CSS variables, scrollbar, @keyframes
  page.tsx                # Main route: Navbar + four sections
  microsoft/
    page.tsx              # /microsoft detail page (coming soon)
  blog/
    page.tsx              # /blog listing page — server component, passes to BlogList
    [slug]/
      page.tsx            # Individual post renderer with prose styles
  admin/
    page.tsx              # Redirects to /admin/home
    login/
      page.tsx            # Login form (unauthenticated)
    (dashboard)/          # Route group — all children require auth (middleware)
      layout.tsx          # Admin shell with sidebar nav
      home/page.tsx       # Edit HomeSection content
      about/page.tsx      # Edit AboutSection content
      contact/page.tsx    # Edit ContactSection content
      thoughts/page.tsx   # Edit "What I'm Up To" card
      music/page.tsx      # Edit music tracks
      gallery/page.tsx    # Edit gallery photos
      blog/
        page.tsx          # List + create blog posts
        [slug]/
          page.tsx        # Thin server wrapper → _EditPostClient.tsx
          _EditPostClient.tsx  # Edit/delete a post (client component)

  api/
    admin/
      auth/route.ts       # POST login, DELETE logout, GET ping
      home/route.ts       # GET/POST home content
      about/route.ts      # GET/POST about content
      contact/route.ts    # GET/POST contact content
      thoughts/route.ts   # GET/POST thoughts content
      music/route.ts      # GET/POST music tracks
      gallery/route.ts    # GET/POST gallery photos
      posts/route.ts      # GET all posts / GET?slug= / PUT / DELETE?slug=
      upload/route.ts     # POST file upload (Vercel Blob or local fallback)

components/
  Navbar.tsx              # 'use client' — floating pill, scroll-spy, Framer Motion
                          #   layoutId sliding indicator, hover preview + whileTap
  WhatImUpToCard.tsx      # 'use client' — emerald gradient card, mouse-tracking glow,
                          #   ripple rings, arrow link to /microsoft
  MusicCard.tsx           # 'use client' — Spotify-style player, HTML5 Audio API,
                          #   local files in /public/music/
  GalleryCard.tsx         # 'use client' — photo carousel, local files in /public/gallery/,
                          #   camera flash + focus reticle effects, film grain overlay
  SparklyName.tsx         # 'use client' — gold star sparkle burst on load, then occasional
  ExternalLinkButton.tsx  # Shared ↗ icon in a circle — internal Link or external <a>
  BlogList.tsx            # 'use client' — tag filter pills + post grid for /blog page
  CatWalk.tsx             # 'use client' — orange tabby walks right→left (unused, kept)
  admin/
    MarkdownEditor.tsx    # Textarea-based markdown editor used in blog post forms
  sections/
    HomeSection.tsx       # Server component — 12-col bento grid
    AboutSection.tsx      # 'use client' — about blocks + 3-state timeline,
                          #   NeuralNetworkCanvas (canvas animation) on Microsoft card,
                          #   spinning MS conic-gradient border, expandable highlighted cards
    BlogSection.tsx       # Server component — 3 most recent posts from content/posts/,
                          #   "View all" link to /blog
    ContactSection.tsx    # 'use client' — platform cards (hover → brand colour + 0.18s
                          #   transition), email card (copy + mailto), GitHub "Soon" card

lib/
  posts.ts                # Build-time markdown reader: gray-matter + marked,
                          #   getAllPosts / getPostBySlug / getAllTags / formatPostDate
  github-content.ts       # GitHub Contents API helpers: githubWriteFile / githubDeleteFile
                          #   Falls back to filesystem writes when GITHUB_TOKEN not set (local dev)
  admin/
    auth.ts               # PBKDF2 password verify, session token helpers
    content.ts            # readContent (filesystem) / writeContent (→ githubWriteFile)

middleware.ts             # Protects /admin/(dashboard)/* routes — redirects to /admin/login

content/
  posts/
    *.md                  # Markdown blog posts with YAML frontmatter
  data/
    *.json                # CMS-managed content (home.json, about.json, contact.json, etc.)
                          # Edited via admin and committed to GitHub via API

public/
  gallery/                # Local photos for GalleryCard (photo1.jpg … photo5.JPG)
  music/                  # Local audio files for MusicCard
```

## Admin CMS

The admin lives at `/admin`. Authentication uses an HTTP-only session cookie.

**How saves work:**
1. Admin form → POST to `/api/admin/*`
2. API route calls `writeContent()` → `githubWriteFile()`
3. GitHub Contents API commits the file to the repo
4. Vercel detects the push and rebuilds (~1 min)
5. New content appears on the live site

**Local dev:** When `GITHUB_TOKEN` is not set, writes go directly to the filesystem instead.

**Required environment variables** (set in Vercel dashboard):

| Variable | Purpose |
|---|---|
| `ADMIN_PASSWORD_HASH` | PBKDF2 hash — format: `pbkdf2:sha256:100000:<salt>:<hash>` |
| `ADMIN_TOKEN` | 64-char random hex — stored in session cookie |
| `GITHUB_TOKEN` | Fine-grained PAT with Contents: read+write on this repo |
| `GITHUB_OWNER` | `henry9960` |
| `GITHUB_REPO` | `mugrid.ge` |
| `BLOB_READ_WRITE_TOKEN` | Auto-set by Vercel Blob — for image uploads (optional locally) |

**Generating credentials locally:**
```bash
# ADMIN_TOKEN
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ADMIN_PASSWORD_HASH
node -e "
  const c=require('crypto'), pw='your-password-here'
  const s=c.randomBytes(16).toString('hex')
  const h=c.pbkdf2Sync(pw,s,100000,32,'sha256').toString('hex')
  console.log('pbkdf2:sha256:100000:'+s+':'+h)
"
```

After changing env vars in Vercel, you must **redeploy** for them to take effect.

## Blog System

Posts live in `content/posts/` as `.md` files. Frontmatter format:

```md
---
title: Post Title
date: 2026-04-10
tags: [Product, AI]
description: One sentence summary shown in cards.
---

Content in markdown...
```

- Posts are sorted by date descending.
- `BlogSection` on the home page shows the 3 most recent.
- `/blog` shows all posts with client-side tag filtering.
- `/blog/[slug]` renders the full post with prose styles.
- Read time is auto-estimated (~200 wpm).
- `gray-matter` parses YAML dates as `Date` objects — always use `toISODate()` helper in `lib/posts.ts`, not `String().slice()`.
- Blog posts can also be created/edited/deleted via the admin at `/admin/blog`.

## Timeline (AboutSection)

Three visual states defined in the `TIMELINE` array:

| State | Appearance |
|---|---|
| `active` | Spinning conic-gradient MS border, NeuralNetworkCanvas, "Now" badge |
| `highlighted` | White card with double-ring dot, badge label, expandable detail (grid-template-rows trick) |
| `inactive` | Muted grey text, hollow dot |

To add a page link to a timeline entry, add `href: '/page-slug'` — an `ExternalLinkButton` renders automatically.

## Design System

**Colours** — white page (`#FFFFFF`), cards `#F7F7F9`. Raw hex values inline when needed. Accent colours only on interactive elements.

**Grid** — 12-column (`grid-cols-12`) with `gap-4` (16px). All layout uses column spans.

**Spacing** — 8pt scale. Prefer Tailwind's default scale (p-4 = 16px, p-6 = 24px, p-8 = 32px).

**Cards** — `bg-[#F7F7F9] rounded-3xl` (24px radius). Interactive cards use inline `onMouseEnter`/`onMouseLeave` with `transition` on the style prop.

**Framer Motion** — used only in Navbar (sliding pill `layoutId="nav-pill"`, `whileTap` press animation). Do not add elsewhere without strong reason.

**ExternalLinkButton** — standardised ↗ icon component. Use for any "opens another page" affordance. Accepts `href`, `external` (boolean), `bg`, `color`, `hoverBg`, `size`.

**`'use client'` boundary** — only components needing browser APIs are client components. Keep server components as the default.

**SVG arrow icon** — `<path d="M7 17L17 7M17 7H7M17 7v10" />` — used consistently across the site for external links and navigation indicators.

## Key Content Locations

| What | Where |
|---|---|
| Bio text | `components/sections/HomeSection.tsx` |
| About blocks | `ABOUT_BLOCKS` array in `AboutSection.tsx` |
| Timeline entries | `TIMELINE` array in `AboutSection.tsx` |
| "What I'm up to" card | `components/WhatImUpToCard.tsx` |
| Music tracks | `MusicCard.tsx` + `/public/music/` |
| Gallery photos | `GalleryCard.tsx` PHOTOS array + `/public/gallery/` |
| Blog posts | `content/posts/*.md` |
| CMS data files | `content/data/*.json` |
| Site metadata / OG | `app/layout.tsx` |
| Microsoft page | `app/microsoft/page.tsx` |

## Adding Gallery Photos

Drop files into `/public/gallery/` then add entries to the `PHOTOS` array in `GalleryCard.tsx`:

```ts
{ src: '/gallery/filename.jpg', caption: 'Optional caption' }
```

The first entry is always shown first.

## Neural Network Canvas Effect

`NeuralNetworkCanvas` in `AboutSection.tsx` — 16 drifting nodes in MS brand colours (`#F25022`, `#7FBA00`, `#00A4EF`, `#FFB900`) connected by lines when within 70px. Speed 0.35, opacity pulses ±0.004/frame. Canvas `400×100`, `pointerEvents: none`, absolutely inset. Documented in `memory/project_neural_network_effect.md`.

## Known Gotchas

- **Do not use `isomorphic-dompurify`** — its `jsdom` dependency chain breaks webpack bundling. It was removed; do not re-add it.
- **Do not add `output: 'export'` to next.config.ts** — breaks all API routes and the admin.
- **Dynamic API routes** (`/api/admin/posts/[slug]`) were eliminated — all post operations use `/api/admin/posts` with query params (`?slug=x`) to avoid static export issues. Keep this pattern.
- **Env var changes in Vercel require a manual redeploy** — auto-deploy only triggers on git push.
- **New blog posts take ~1 min to appear** — Vercel must rebuild after the GitHub commit.
