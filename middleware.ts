import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'admin_session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin UI routes — allow login page through
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(COOKIE_NAME)?.value
    const expected = process.env.ADMIN_TOKEN

    if (!expected || token !== expected) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Protect admin API routes — allow /api/admin/auth through
  if (
    pathname.startsWith('/api/admin') &&
    !pathname.startsWith('/api/admin/auth')
  ) {
    const token = request.cookies.get(COOKIE_NAME)?.value
    const expected = process.env.ADMIN_TOKEN

    if (!expected || token !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
