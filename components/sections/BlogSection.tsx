const PLACEHOLDER_POSTS = [
  {
    date: 'July 2026',
    title: 'Example blog post',
    tags: ['Design', 'Systems'],
    readTime: '5 min read',
  },
  {
    date: 'June 2026',
    title: 'Example blog post',
    tags: ['Tools', 'Craft'],
    readTime: '8 min read',
  },
  {
    date: 'May 2026',
    title: 'Example blog post',
    tags: ['AI', 'Product'],
    readTime: '6 min read',
  },
]

export default function BlogSection() {
  return (
    <div className="relative select-none">
      {/* Blurred post cards beneath */}
      <div
        className="grid grid-cols-12 gap-4"
        style={{ opacity: 0.35, filter: 'blur(1.5px)', pointerEvents: 'none' }}
      >
        {PLACEHOLDER_POSTS.map((post, i) => (
          <div
            key={i}
            className="col-span-12 md:col-span-4 bg-[#F7F7F9] rounded-3xl p-6"
          >
            <p className="text-xs text-[#ABABAB] mb-2">
              {post.date} · {post.readTime}
            </p>
            <h3 className="text-lg font-semibold text-[#0A0A0A] leading-snug mb-4">
              {post.title}
            </h3>
            <hr className="border-t border-[#E4E4E8] mb-4" />
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-[#6B6B6B] bg-[#EDEDED] rounded-full px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon pill */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="bg-[#F7F7F9] rounded-2xl px-5 py-3"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}
        >
          <p className="text-sm font-semibold text-[#0A0A0A]">
            Blog — Coming Soon
          </p>
        </div>
      </div>
    </div>
  )
}
