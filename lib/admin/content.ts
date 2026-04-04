import fs from 'fs'
import path from 'path'
import { githubWriteFile } from '@/lib/github-content'

const DATA_DIR = path.join(process.cwd(), 'content/data')

export function readContent<T>(file: string, fallback?: T): T {
  const filePath = path.join(DATA_DIR, file)
  if (!fs.existsSync(filePath)) {
    if (fallback !== undefined) return fallback
    throw new Error(`Content file not found: ${file}`)
  }
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as T
}

export async function writeContent(file: string, data: unknown): Promise<void> {
  const content = JSON.stringify(data, null, 2)
  await githubWriteFile(`content/data/${file}`, content, `Update ${file} via admin`)
}
