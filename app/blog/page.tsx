import Link from 'next/link'
import { getAllPosts, getAllTags } from '@/lib/posts'
import BlogList from '@/components/BlogList'

export const metadata = {
  title: 'Blog — Harry Mugridge',
  description: 'Thoughts on product, AI, and building things.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const tags  = getAllTags()

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-8 py-12">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#8A8A8A] hover:text-[#0A0A0A] transition-colors duration-150 mb-12"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" />
          </svg>
          Back
        </Link>

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-semibold text-[#0A0A0A] tracking-tight mb-1">Blog</h1>
          <p className="text-base text-[#6B6B6B] font-light">
            Thoughts on product, AI, and building things.
          </p>
        </div>

        <hr className="border-t border-[#E4E4E8] mb-4" />

        <BlogList posts={posts} tags={tags} />

      </div>
    </main>
  )
}
