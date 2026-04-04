import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

export async function GET() {
  try {
    const posts = getAllPosts()
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json({ error: 'Failed to read posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { slug, title, date, tags, description, body } = await request.json()

    if (!slug || !title) {
      return NextResponse.json({ error: 'slug and title are required' }, { status: 400 })
    }

    const filePath = path.join(POSTS_DIR, `${slug}.md`)
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 },
      )
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
