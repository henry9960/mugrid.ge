import fs from 'fs'
import path from 'path'

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

export function writeContent(file: string, data: unknown): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  const filePath = path.join(DATA_DIR, file)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}
