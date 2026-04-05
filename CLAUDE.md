# CLAUDE.md — Project Operating Manual

> Henry's portfolio site. Last updated: 2026-04-05.

---

## 1. Project Overview

Personal portfolio for Henry (henry9960) — a trilingual Business & Management student at Royal Holloway with internship experience at Spotify, Amazon, TikTok, Intel, and an upcoming Microsoft PM internship (Summer 2026).

- **URL:** `harry.mugrid.ge`
- **Purpose:** Professional online presence — bio, timeline, blog, contact
- **Stage:** Live and actively developed. Core structure is complete. Content is WIP (blog posts are placeholders, several timeline detail sections say "WIP").
- **Goal:** Polish the existing site, fill in real content, and add features as needed.

---

## 2. Current Build Status

**Complete:**
- Full bento grid layout (home, about, blog, contact sections)
- Admin CMS at `/admin` — auth, all content editors, blog CRUD
- Blog system — markdown posts, tag filtering, individual post pages
- Timeline with 3 visual states (active/highlighted/inactive)
- `accentColor` support on highlighted timeline cards (orange tint for Royal Holloway)
- Click effects — multicolour star burst + ripple rings on every click (no custom cursor)
- Music card (Spotify-style player), gallery card (photo carousel with film effects)
- `WhatImUpToCard` — emerald gradient card with mouse-tracking glow, links to Microsoft blog post

**Partially complete / WIP:**
- Blog posts exist but contain placeholder text — Spotify detail, Royal Holloway detail, and the "How I Designed ??? to ???" post all need real content
- `/microsoft` page redirects to `/blog/microsoft-product-manager-intern` — that post is also a placeholder
- Royal Holloway and Spotify timeline entries have `"detail": "WIP — ..."` — need real copy
- No `/university` page exists yet (royal_holloway entry has `href: '/university'`)

**Not started:**
- Dedicated `/university` page
- Any analytics or visitor tracking
- Dark mode

**Broken / messy:**
- Blog post titled "How I Designed ??? to ???" — title is a placeholder, created via admin, shows on the site
- The `content/posts/product-showcase.md` and `ai-and-product-thinking.md` — check if these are real or placeholders before surfacing them

---

## 3. Architecture & Setup

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 3, Framer Motion 11

**Hosting:** Vercel — auto-deploys on push to `main`. No GitHub Actions. No static export.

**Key rule:** Never add `output: 'export'` to `next.config.ts` — breaks all API routes and admin.

**Commands:**
```bash
npm run dev      # localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

**File structure:**
```
app/
  layout.tsx                    # DM Sans font, OG/Twitter metadata
  globals.css                   # CSS vars, @keyframes (including .cc-star, .cc-click-ripple)
  page.tsx                      # Main route: Navbar + 4 sections (home/about/blog/contact)
  microsoft/page.tsx            # Redirects to /blog/microsoft-product-manager-intern
  blog/page.tsx                 # Blog listing → BlogList client component
  blog/[slug]/page.tsx          # Individual post renderer (prose styles)
  admin/                        # Auth-gated CMS
    login/page.tsx
    (dashboard)/layout.tsx      # Admin shell with sidebar
    (dashboard)/home/page.tsx
    (dashboard)/about/page.tsx  # Includes accent colour picker for highlighted entries
    (dashboard)/contact/page.tsx
    (dashboard)/thoughts/page.tsx
    (dashboard)/music/page.tsx
    (dashboard)/gallery/page.tsx
    (dashboard)/blog/           # List, create, edit, delete posts
  api/admin/                    # All CMS API routes (auth, home, about, contact, thoughts, music, gallery, posts, upload)

components/
  Navbar.tsx                    # Framer Motion floating pill, scroll-spy
  CustomCursor.tsx              # Click effects only (no cursor) — star burst + ripple
  WhatImUpToCard.tsx            # Emerald gradient "What I'm up to" card
  MusicCard.tsx                 # HTML5 audio player
  GalleryCard.tsx               # Photo carousel, film effects
  SparklyName.tsx               # Gold sparkle on name load
  ExternalLinkButton.tsx        # Shared ↗ icon component
  BlogList.tsx                  # Client tag filter + post grid
  sections/
    HomeSection.tsx             # Server component, 12-col bento grid
    AboutSection.tsx            # Client — about blocks + timeline + NeuralNetworkCanvas
    BlogSection.tsx             # Server — 3 most recent posts
    ContactSection.tsx          # Client — social cards, email copy, GitHub card

lib/
  posts.ts                      # gray-matter + marked, getAllPosts/getPostBySlug/getAllTags
  github-content.ts             # GitHub Contents API write/delete (filesystem fallback locally)
  admin/auth.ts                 # PBKDF2 password verify, session token helpers
  admin/content.ts              # readContent / writeContent

middleware.ts                   # Protects /admin/(dashboard)/* → redirects to /admin/login

content/
  posts/*.md                    # Blog posts (YAML frontmatter + markdown body)
  data/*.json                   # CMS-managed content (home, about, contact, thoughts, music, gallery)

public/
  gallery/                      # Local photos (photo1.jpg … photo5.JPG)
  music/                        # Local audio files
```

**Admin auth:**
- PBKDF2 password hash stored in `ADMIN_PASSWORD_HASH` env var
- Session stored as HTTP-only cookie (`admin_session`)
- `middleware.ts` guards all `/admin/(dashboard)/*` routes

**Environment variables (Vercel dashboard):**

| Variable | Purpose |
|---|---|
| `ADMIN_PASSWORD_HASH` | `pbkdf2:sha256:100000:<salt>:<hash>` |
| `ADMIN_TOKEN` | 64-char hex — stored in session cookie |
| `GITHUB_TOKEN` | Fine-grained PAT with Contents read+write |
| `GITHUB_OWNER` | `henry9960` |
| `GITHUB_REPO` | `mugrid.ge` |
| `BLOB_READ_WRITE_TOKEN` | Auto-set by Vercel Blob (image uploads) |

**Local dev env:** `.env.local` lives in the project root. If running from a git worktree, copy it in — worktrees do not inherit it automatically.

**How admin saves work:**
1. Form → POST `/api/admin/*`
2. API → `writeContent()` → `githubWriteFile()` (GitHub Contents API)
3. GitHub commit → Vercel detects push → auto-rebuild (~1 min)
4. Local dev (no `GITHUB_TOKEN`): writes go directly to filesystem

---

## 4. Product & Design Rules

**Colours:**
- Page background: `#FFFFFF`
- Card background: `#F7F7F9`
- Primary text: `#0A0A0A`
- Secondary text: `#6B6B6B`
- Muted text: `#ABABAB`
- Borders: `#E4E4E8`
- Accent colours only on interactive or branded elements — inline hex, not Tailwind arbitrary where possible

**Grid:** 12-column (`grid-cols-12 gap-4`). All layout uses column spans. 1200px centred container.

**Spacing:** 8pt scale — Tailwind defaults (p-4=16px, p-6=24px, p-8=32px).

**Cards:** `bg-[#F7F7F9] rounded-3xl` (24px radius). Hover states use inline `onMouseEnter`/`onMouseLeave` + `transition` on `style` prop — not Tailwind hover classes.

**Framer Motion:** Only in `Navbar.tsx` (`layoutId="nav-pill"`, `whileTap`). Do not add elsewhere without strong reason.

**`'use client'`:** Server components are the default. Only add the directive when browser APIs are required.

**ExternalLinkButton:** Use for every "opens another page" affordance. Props: `href`, `external` (bool), `bg`, `color`, `hoverBg`, `size`.

**SVG arrow icon:** `<path d="M7 17L17 7M17 7H7M17 7v10" />` — used consistently for external links.

**Click effects:** Defined in `CustomCursor.tsx` + `globals.css`. Stars spawn on every click; emerald colours when clicking a link/button, gold/multicolour otherwise. Zoom-corrected coordinates (CSS zoom on `html` affects `clientX/clientY`).

---

## 5. Content Model

**CMS-managed (admin editable, stored in `content/data/*.json`, committed via GitHub API):**
- `home.json` — name, tagline, bio, nowStatus
- `about.json` — blocks (background/what's next/hobbies), location, full timeline array
- `contact.json` — email, social links (platform/handle/url/enabled)
- `thoughts.json` — "What I'm up to" card content
- `music.json` — track list (title/artist/album/albumArtUrl/src/startTime)
- `gallery.json` — photo list (src/caption)

**Blog posts (`content/posts/*.md`):**
```yaml
---
title: Post Title
date: 2026-04-10
tags: [Product, AI]
description: One sentence summary.
---
Markdown body...
```
- Sorted by date descending. `BlogSection` shows 3 most recent.
- `gray-matter` parses dates as `Date` objects — always use `toISODate()` helper in `lib/posts.ts`, never `String().slice()`.
- Slugs are derived from filenames.

**Timeline (`content/data/about.json`):**

| State | Appearance |
|---|---|
| `active` | Spinning conic-gradient border, NeuralNetworkCanvas, "Now" badge |
| `highlighted` | White card, double-ring dot, expandable detail section, badge label, optional `accentColor` |
| `inactive` | Muted grey text, hollow dot |

- `accentColor?: string` (hex) — tints background (6% opacity), border (35% opacity), badge (12% opacity) of highlighted cards
- `href?: string` — adds an `ExternalLinkButton` to the card
- `detail?: string` — expandable content shown on click (highlighted state only)
- `badgeLabel?: string` — label text on the badge chip

**Gallery photos:**
- Drop files into `/public/gallery/`
- Add entries to `PHOTOS` array in `GalleryCard.tsx`: `{ src: '/gallery/filename.jpg', caption: '...' }`

---

## 6. Key Decisions Made

- **No static export** — site runs as a full Next.js server on Vercel. `output: 'export'` was removed because it broke API routes. Never re-add it.
- **No dynamic API segments** — all post operations go to `/api/admin/posts` with `?slug=` query params. `/api/admin/posts/[slug]` does not exist and should not be created.
- **No `isomorphic-dompurify`** — its `jsdom` dependency breaks webpack bundling. Was removed. Do not re-add.
- **GitHub Contents API for writes** — admin saves commit directly to the repo, which triggers Vercel rebuild. This is intentional; it means content changes are version-controlled.
- **Click effects only, no custom cursor** — custom cursor was removed; only the star-burst + ripple effects on click remain. This was a deliberate UX decision.
- **Framer Motion isolated to Navbar** — adding it elsewhere requires justification.
- **`accentColor` on timeline** — per-entry hex colour field that tints highlighted cards; admin exposes a colour picker only for `highlighted` state entries.
- **`/microsoft` redirects to blog post** — there is no dedicated Microsoft page; it redirects to the blog post slug.

---

## 7. Current Priorities

**Immediate (content that needs filling in):**
1. Write real detail text for Spotify timeline entry (currently "WIP")
2. Write real detail text for Royal Holloway timeline entry (currently "WIP")
3. Rename/rewrite "How I Designed ??? to ???" blog post — it has a placeholder title
4. Flesh out the Microsoft blog post (`microsoft-product-manager-intern.md`) beyond its skeleton

**Short-term (features/pages):**
- Build `/university` page — Royal Holloway timeline entry links to it but it doesn't exist
- Decide what to do with `product-showcase.md` and `ai-and-product-thinking.md` — real content or delete

---

## 8. Known Issues & Risks

- **"How I Designed ??? to ???" shows on live site** — placeholder blog post with a broken title is publicly visible
- **`/university` 404** — the Royal Holloway timeline card has `href: '/university'` but that route doesn't exist
- **WIP timeline details** — Spotify and Royal Holloway `detail` fields are placeholder text; they appear if a user expands those cards
- **Env vars not in worktrees** — `.env.local` is only in the project root. Running dev from a git worktree = no env vars = admin login fails. Fix: copy `.env.local` into the worktree.
- **Vercel env var changes need manual redeploy** — auto-deploy only fires on git push
- **Blog rebuild lag** — new posts take ~1 min after commit to appear on the live site
- **No test suite** — all verification is manual or via preview

---

## 9. Working Instructions for Future Claude Sessions

- **Read the file before editing it.** The Read tool is required before any Edit or Write call — the system enforces this.
- **Prefer Edit over Write** for existing files — only rewrite a file completely if the change is pervasive.
- **Check the worktree `.env.local`** at session start if any admin or auth work is needed. It may be missing.
- **Content changes go through `content/data/*.json`** — do not hardcode content into components unless it's purely structural.
- **Timeline data lives in `content/data/about.json`**, not in `AboutSection.tsx` — the CLAUDE.md previously said "ABOUT_BLOCKS array in AboutSection.tsx" and "TIMELINE array in AboutSection.tsx" but these have been migrated to the JSON file and the CMS.
- **Do not touch Framer Motion** unless specifically asked — it's isolated to Navbar.
- **Incremental over large refactors** — this is a live production site. Make targeted changes.
- **Verify in the preview after UI changes** — use `preview_screenshot` or `preview_inspect` to confirm visual changes before ending a turn.
- **Click effects are in two places:** JS logic in `CustomCursor.tsx`, CSS keyframes in `globals.css`. Both must be in sync.
- **API routes use query params, not dynamic segments** — pattern: `/api/admin/posts?slug=x` not `/api/admin/posts/[x]`.

---

## 10. Quick Start for Next Session

**Read first:**
1. This file (CLAUDE.md) — already done
2. `content/data/about.json` — live timeline/about data
3. The specific component file you're editing

**Before coding:**
- Check whether `.env.local` exists in the worktree if auth/admin is involved
- Run `npm run dev` and open `localhost:3000` to confirm the dev server is clean
- Check `preview_console_logs` for errors before making changes

**Most-edited files recently:**
- `content/data/about.json` — timeline data
- `components/sections/AboutSection.tsx` — timeline rendering
- `app/admin/(dashboard)/about/page.tsx` — admin about editor
- `app/globals.css` — click effects CSS
- `components/CustomCursor.tsx` — click effects JS

---

## Session Snapshot

**Last worked on (2026-04-05):**
- Added `accentColor` support to timeline entries — Royal Holloway card now shows an orange tint (`#E87722`) on background, border, and badge
- Added accent colour picker to admin `/admin/about` — appears only for `highlighted` state entries
- Added click effects (star burst + ripple rings) across the whole site via `CustomCursor.tsx` + `globals.css`
- Fixed admin login failure in worktrees — `.env.local` was missing from the worktree directory

**Next session should:**
1. Fill in real content for Spotify and Royal Holloway timeline detail fields
2. Rename the "How I Designed ??? to ???" placeholder post or delete it
3. Decide whether to build the `/university` page (Royal Holloway card links to it)

**Warnings before editing:**
- `/university` route does not exist — creating a link to it will 404
- The blog post "How I Designed ??? to ???" is live on the public site with a broken title
- Do not add `output: 'export'` to `next.config.ts` under any circumstances
- If working from a git worktree, check that `.env.local` is present in the worktree root before testing admin features

---

## Reference: Generating Admin Credentials

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

After changing env vars in Vercel, trigger a manual redeploy — env var changes don't auto-deploy.
