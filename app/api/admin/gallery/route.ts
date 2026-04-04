import { readContent, writeContent } from '@/lib/admin/content'
import type { GalleryContent } from '@/lib/types/content'
import { NextResponse } from 'next/server'

const FALLBACK: GalleryContent = { photos: [] }

export async function GET() {
  const data = readContent<GalleryContent>('gallery.json', FALLBACK)
  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  const body = await req.json() as GalleryContent
  writeContent('gallery.json', body)
  return NextResponse.json({ ok: true })
}
