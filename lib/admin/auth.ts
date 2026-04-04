export const COOKIE_NAME = 'admin_session'

export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return password === expected
}

export function getSessionToken(): string {
  return process.env.ADMIN_TOKEN ?? ''
}

export function isValidToken(token: string | undefined): boolean {
  const expected = process.env.ADMIN_TOKEN
  if (!expected || !token) return false
  return token === expected
}
