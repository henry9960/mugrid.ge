import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, getSessionToken, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/admin/auth'

export async function GET() {
  return new Response(null, { status: 204 })
}

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = getSessionToken()
  if (!token) {
    return NextResponse.json(
      { error: 'Server not configured — set ADMIN_TOKEN in .env.local' },
      { status: 500 },
    )
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(COOKIE_NAME)
  return response
}
