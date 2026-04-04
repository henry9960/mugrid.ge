import EditPostClient from './_EditPostClient'

/** No admin blog pages are generated in the static export. */
export function generateStaticParams() {
  return []
}

export default function EditPostPage() {
  return <EditPostClient />
}
