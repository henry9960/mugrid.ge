import Link from 'next/link'
import { getAllPosts, getPostBySlug, formatPostDate } from '@/lib/posts'

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  return {
    title: `${post.title} — Harry Mugridge`,
    description: post.description,
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-12">

        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[#8A8A8A] hover:text-[#0A0A0A] transition-colors duration-150 mb-12"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" />
          </svg>
          All posts
        </Link>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs font-medium text-[#6B6B6B] bg-[#F0F0F3] rounded-full px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#0A0A0A] tracking-tight leading-tight mb-3">
              {post.title}
            </h1>
            <p className="text-sm text-[#ABABAB]">
              {formatPostDate(post.date)} · {post.readTime}
            </p>
          </div>

          <hr className="border-t border-[#E4E4E8] mb-8" />

          {/* Body */}
          <style>{`
            .prose h1, .prose h2, .prose h3 {
              font-weight: 600;
              color: #0A0A0A;
              line-height: 1.3;
              margin-top: 2em;
              margin-bottom: 0.6em;
            }
            .prose h1 { font-size: 1.75rem; }
            .prose h2 { font-size: 1.3rem; }
            .prose h3 { font-size: 1.1rem; }
            .prose p  { color: #3A3A3A; line-height: 1.75; margin-bottom: 1.25em; font-size: 1rem; }
            .prose ul, .prose ol { color: #3A3A3A; line-height: 1.75; margin-bottom: 1.25em; padding-left: 1.5em; }
            .prose li { margin-bottom: 0.4em; }
            .prose a  { color: #0A0A0A; text-decoration: underline; text-underline-offset: 3px; }
            .prose a:hover { color: #3A3A3A; }
            .prose code { background: #F0F0F3; border-radius: 4px; padding: 0.1em 0.4em; font-size: 0.875em; color: #0A0A0A; }
            .prose pre  { background: #F0F0F3; border-radius: 12px; padding: 1.25em; overflow-x: auto; margin-bottom: 1.25em; }
            .prose pre code { background: none; padding: 0; }
            .prose blockquote { border-left: 3px solid #E4E4E8; padding-left: 1.25em; color: #6B6B6B; font-style: italic; margin: 1.5em 0; }
            .prose hr { border-top: 1px solid #E4E4E8; margin: 2em 0; }
            .prose strong { color: #0A0A0A; font-weight: 600; }
          `}</style>
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>

      </div>
    </main>
  )
}
