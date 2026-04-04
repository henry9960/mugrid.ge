import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'
import { githubWriteFile, githubDeleteFile } from '@/lib/github-content'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

function toISODate(raw: unknown): string {
  if (raw instanceof Date) return raw.toISOString().slice(0, 10)
  return String(raw).slice(0, 10)
}

/** GET /api/admin/posts         → list all posts
 *  GET /api/admin/posts?slug=x  → get single post */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')

  if (slug) {
    const filePath = path.join(POSTS_DIR, `${slug}.md`)
    if (!fs.existsSync(filePath) && !process.env.GITHUB_TOKEN) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    let raw: string
    if (fs.existsSync(filePath)) {
      raw = fs.readFileSync(filePath, 'utf-8')
    } else {
      // On Vercel: fetch from GitHub directly
      const { token, owner, repo, branch } = { token: process.env.GITHUB_TOKEN, owner: process.env.GITHUB_OWNER, repo: process.env.GITHUB_REPO, branch: process.env.GITHUB_BRANCH ?? 'main' }
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/content/posts/${slug}.md?ref=${branch}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
      })
      if (!res.ok) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      const data = await res.json() as { content: string }
      raw = Buffer.from(data.content, 'base64').toString('utf-8')
    }
    const { data, content } = matter(raw)
    return NextResponse.json({
      slug,
      title:        data.title        ?? '',
      date:         toISODate(data.date),
      tags:         (data.tags        as string[]) ?? [],
      description:  (data.description as string)  ?? '',
      company:      (data.company      as string) ?? '',
      companyColor: (data.companyColor as string) ?? '',
      readTime:     (data.readTime     as string) ?? '',
      body:         content.trimStart(),
    })
  }

  try {
    return NextResponse.json(getAllPosts())
  } catch {
    return NextResponse.json({ error: 'Failed to read posts' }, { status: 500 })
  }
}

/** POST /api/admin/posts → create new post */
export async function POST(request: NextRequest) {
  try {
    const { slug, title, date, tags, description, company, companyColor, readTime, body } = await request.json()
    if (!slug || !title) {
      return NextResponse.json({ error: 'slug and title are required' }, { status: 400 })
    }
    const filePath = path.join(POSTS_DIR, `${slug}.md`)
    // Check for duplicates: local filesystem (build-time posts) or GitHub (admin-created posts)
    const localExists = fs.existsSync(filePath)
    if (localExists) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 })
    }
    const frontmatter: Record<string, unknown> = {
      title,
      date: date ?? new Date().toISOString().slice(0, 10),
      tags: tags ?? [],
      description: description ?? '',
    }
    if (company)      frontmatter.company      = company
    if (companyColor) frontmatter.companyColor = companyColor
    if (readTime)     frontmatter.readTime     = readTime
    const fileContent = matter.stringify(body ?? '', frontmatter)
    await githubWriteFile(`content/posts/${slug}.md`, fileContent, `Add post: ${title}`)
    return NextResponse.json({ success: true, slug })
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

/** PUT /api/admin/posts → update post (slug passed in body) */
export async function PUT(request: NextRequest) {
  try {
    const { slug, title, date, tags, description, company, companyColor, readTime, body, newSlug } = await request.json()
    const targetSlug = newSlug && newSlug !== slug ? newSlug : slug

    const oldPath = path.join(POSTS_DIR, `${slug}.md`)
    const newPath = path.join(POSTS_DIR, `${targetSlug}.md`)

    if (targetSlug !== slug && fs.existsSync(newPath)) {
      return NextResponse.json({ error: 'A post with that slug already exists' }, { status: 400 })
    }

    const frontmatter: Record<string, unknown> = {
      title,
      date,
      tags: tags ?? [],
      description: description ?? '',
    }
    if (company)      frontmatter.company      = company
    if (companyColor) frontmatter.companyColor = companyColor
    if (readTime)     frontmatter.readTime     = readTime
    const fileContent = matter.stringify(body ?? '', frontmatter)

    await githubWriteFile(`content/posts/${targetSlug}.md`, fileContent, `Update post: ${title}`)

    if (targetSlug !== slug) {
      await githubDeleteFile(`content/posts/${slug}.md`, `Rename post: ${slug} → ${targetSlug}`)
    }

    return NextResponse.json({ success: true, slug: targetSlug })
  } catch {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

/** DELETE /api/admin/posts?slug=x → delete post */
export async function DELETE(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  try {
    await githubDeleteFile(`content/posts/${slug}.md`, `Delete post: ${slug}`)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
