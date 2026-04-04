export const dynamic = 'force-static'
export function generateStaticParams() { return [] }

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

function toISODate(raw: unknown): string {
  if (raw instanceof Date) return raw.toISOString().slice(0, 10)
  return String(raw).slice(0, 10)
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  try {
    const { title, date, tags, description, body, newSlug } = await request.json()

    const targetSlug = newSlug && newSlug !== slug ? newSlug : slug
    const oldPath = path.join(POSTS_DIR, `${slug}.md`)
    const newPath = path.join(POSTS_DIR, `${targetSlug}.md`)

    // If renaming slug, ensure the new slug is available
    if (targetSlug !== slug && fs.existsSync(newPath)) {
      return NextResponse.json(
        { error: 'A post with that slug already exists' },
        { status: 400 },
      )
    }

    const fileContent = matter.stringify(body ?? '', {
      title,
      date,
      tags: tags ?? [],
      description: description ?? '',
    })

    fs.writeFileSync(newPath, fileContent, 'utf-8')

    // Remove old file if slug changed
    if (targetSlug !== slug && fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath)
    }

    return NextResponse.json({ success: true, slug: targetSlug })
  } catch {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const filePath = path.join(POSTS_DIR, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  fs.unlinkSync(filePath)
  return NextResponse.json({ success: true })
}
