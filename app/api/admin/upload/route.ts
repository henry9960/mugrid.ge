import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png'
  const allowed = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif']
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')

  // On Vercel use Blob storage; locally fall back to /public/logos/
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob')
    const blob = await put(`logos/${safeName}`, file, { access: 'public', addRandomSuffix: false })
    return NextResponse.json({ url: blob.url })
  }

  const { writeFileSync, mkdirSync } = await import('fs')
  const { join } = await import('path')
  const dir = join(process.cwd(), 'public', 'logos')
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, safeName), Buffer.from(await file.arrayBuffer()))
  return NextResponse.json({ url: `/logos/${safeName}` })
}
