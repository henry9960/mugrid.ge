import type { NextConfig } from 'next'

// Static export is only used for the GitHub Pages build.
// Set STATIC_EXPORT=true in the build environment to produce the ./out directory.
// Locally (npm run dev / npm run build without this flag) the full Next.js server
// runs — which is required for the /admin CMS and its API routes to work.
const isStaticExport = process.env.STATIC_EXPORT === 'true'

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
}

export default nextConfig
