import { readContent, writeContent } from '@/lib/admin/content'
import type { MusicContent } from '@/lib/types/content'
import { NextResponse } from 'next/server'

const FALLBACK: MusicContent = { tracks: [] }

export async function GET() {
  const data = readContent<MusicContent>('music.json', FALLBACK)
  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  const body = await req.json() as MusicContent
  writeContent('music.json', body)
  return NextResponse.json({ ok: true })
}
