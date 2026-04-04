import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

export interface PostMeta {
  slug:        string
  title:       string
  date:        string   // ISO string e.g. "2026-04-01"
  tags:        string[]
  description: string
  readTime:    string
}

export interface Post extends PostMeta {
  html: string
}

/** gray-matter parses YAML dates as Date objects — convert safely to YYYY-MM-DD */
function toISODate(raw: unknown): string {
  if (raw instanceof Date) return raw.toISOString().slice(0, 10)
  return String(raw).slice(0, 10)
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

function formatDate(raw: string | Date): string {
  const d = typeof raw === 'string' ? new Date(raw) : raw
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  return fs
    .readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const slug = file.replace(/\.md$/, '')
      const raw  = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
      const { data, content } = matter(raw)
      return {
        slug,
        title:       data.title       as string,
        date:        toISODate(data.date),
        tags:        (data.tags       as string[]) ?? [],
        description: data.description as string ?? '',
        readTime:    estimateReadTime(content),
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getPostBySlug(slug: string): Post {
  const file = path.join(POSTS_DIR, `${slug}.md`)
  const raw  = fs.readFileSync(file, 'utf-8')
  const { data, content } = matter(raw)
  const html = DOMPurify.sanitize(marked(content) as string)

  return {
    slug,
    title:       data.title       as string,
    date:        toISODate(data.date),
    tags:        (data.tags       as string[]) ?? [],
    description: data.description as string ?? '',
    readTime:    estimateReadTime(content),
    html,
  }
}

export function getAllTags(): string[] {
  const tags = new Set<string>()
  getAllPosts().forEach(p => p.tags.forEach(t => tags.add(t)))
  return Array.from(tags).sort()
}

export function formatPostDate(dateStr: string): string {
  return formatDate(dateStr)
}
