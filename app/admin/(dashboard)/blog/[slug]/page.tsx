import EditPostClient from './_EditPostClient'

/** Admin blog edit is only used locally. Generate one placeholder so the
 *  static export doesn't reject this dynamic route. The client component
 *  handles real slugs at runtime via useParams(). */
export function generateStaticParams() {
  return [{ slug: '_' }]
}

export default function EditPostPage() {
  return <EditPostClient />
}
