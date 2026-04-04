import crypto from 'crypto'

export const COOKIE_NAME = 'admin_session'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/**
 * Verify a plaintext password against the stored PBKDF2 hash.
 * Hash format: pbkdf2:sha256:<iterations>:<salt-hex>:<hash-hex>
 */
export function verifyPassword(password: string): boolean {
  const stored = process.env.ADMIN_PASSWORD_HASH
  if (!stored) return false

  const parts = stored.split(':')
  if (parts.length !== 5 || parts[0] !== 'pbkdf2') return false

  const [, digest, iterStr, saltHex, expectedHex] = parts
  const iterations = parseInt(iterStr, 10)
  if (!iterations) return false

  const actual = crypto
    .pbkdf2Sync(password, saltHex, iterations, 32, digest)
    .toString('hex')

  // Timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(actual, 'hex'),
    Buffer.from(expectedHex, 'hex'),
  )
}

export function getSessionToken(): string {
  return process.env.ADMIN_TOKEN ?? ''
}

/**
 * Timing-safe token comparison — prevents timing attacks on the session cookie.
 */
export function isValidToken(token: string | undefined): boolean {
  const expected = process.env.ADMIN_TOKEN
  if (!expected || !token) return false

  // Pad/truncate to equal length before comparing
  const a = Buffer.from(token.padEnd(expected.length, '\0').slice(0, expected.length))
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false

  return crypto.timingSafeEqual(a, b)
}
