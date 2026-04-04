'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin/home')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Invalid password')
      }
    } catch {
      setError('Something went wrong — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: '#F7F7F9' }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-8"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Header */}
        <div className="mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: '#0A0A0A' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold" style={{ color: '#0A0A0A' }}>
            Admin login
          </h1>
          <p className="text-sm mt-1" style={{ color: '#ABABAB' }}>
            harry.mugrid.ge
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: '#ABABAB' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              required
              className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4E4E8',
                color: '#0A0A0A',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#0A0A0A')}
              onBlur={e => (e.currentTarget.style.borderColor = '#E4E4E8')}
            />
          </div>

          {error && (
            <p className="text-xs rounded-xl px-3 py-2" style={{ color: '#DC2626', backgroundColor: '#FEF2F2' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-2.5 text-sm font-medium transition-colors"
            style={{
              backgroundColor: '#0A0A0A',
              color: '#FFFFFF',
              opacity: loading ? 0.5 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => {
              if (!loading)
                (e.currentTarget as HTMLElement).style.backgroundColor = '#2A2A2A'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#0A0A0A'
            }}
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>
    </main>
  )
}
