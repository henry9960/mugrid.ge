export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'
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
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)
    return NextResponse.json({
      slug,
      title: data.title ?? '',
      date: toISODate(data.date),
      tags: (data.tags as string[]) ?? [],
      description: (data.description as string) ?? '',
      body: content.trimStart(),
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
    const { slug, title, date, tags, description, body } = await request.json()
    if (!slug || !title) {
      return NextResponse.json({ error: 'slug and title are required' }, { status: 400 })
    }
    const filePath = path.join(POSTS_DIR, `${slug}.md`)
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 })
    }
    const fileContent = matter.stringify(body ?? '', {
      title,
      date: date ?? new Date().toISOString().slice(0, 10),
      tags: tags ?? [],
      description: description ?? '',
    })
    fs.writeFileSync(filePath, fileContent, 'utf-8')
    return NextResponse.json({ success: true, slug })
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

/** PUT /api/admin/posts → update post (slug passed in body) */
export async function PUT(request: NextRequest) {
  try {
    const { slug, title, date, tags, description, body, newSlug } = await request.json()
    const targetSlug = newSlug && newSlug !== slug ? newSlug : slug
    const oldPath = path.join(POSTS_DIR, `${slug}.md`)
    const newPath = path.join(POSTS_DIR, `${targetSlug}.md`)

    if (targetSlug !== slug && fs.existsSync(newPath)) {
      return NextResponse.json({ error: 'A post with that slug already exists' }, { status: 400 })
    }

    const fileContent = matter.stringify(body ?? '', {
      title,
      date,
      tags: tags ?? [],
      description: description ?? '',
    })
    fs.writeFileSync(newPath, fileContent, 'utf-8')
    if (targetSlug !== slug && fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath)
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

  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
  fs.unlinkSync(filePath)
  return NextResponse.json({ success: true })
}
