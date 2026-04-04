import { NextRequest, NextResponse } from 'next/server'
import { readContent, writeContent } from '@/lib/admin/content'
import type { ContactContent } from '@/lib/types/content'

export async function GET() {
  try {
    const data = readContent<ContactContent>('contact.json')
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = (await request.json()) as ContactContent
    await writeContent('contact.json', data)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}
