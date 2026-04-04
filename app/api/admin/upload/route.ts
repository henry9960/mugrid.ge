import { writeFileSync, mkdirSync } from 'fs'
import { join, extname } from 'path'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const ext = extname(file.name).toLowerCase() || '.png'
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
  }

  const dir = join(process.cwd(), 'public', 'logos')
  mkdirSync(dir, { recursive: true })

  // Use a stable filename based on the original name so re-uploads overwrite
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const dest = join(dir, safeName)

  const buffer = Buffer.from(await file.arrayBuffer())
  writeFileSync(dest, buffer)

  return NextResponse.json({ url: `/logos/${safeName}` })
}
