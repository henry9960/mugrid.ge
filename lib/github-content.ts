/**
 * GitHub Contents API helpers.
 *
 * When GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO are set (i.e. on Vercel),
 * writes go through the GitHub API so they land as commits and trigger a
 * Vercel redeploy.  When those vars are absent (local dev), the helpers fall
 * back to direct filesystem writes so `npm run dev` continues to work without
 * any extra credentials.
 */

import fs from 'fs'
import path from 'path'

const API = 'https://api.github.com'

function cfg() {
  return {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER,
    repo:  process.env.GITHUB_REPO,
    branch: process.env.GITHUB_BRANCH ?? 'main',
  }
}

function isConfigured() {
  const { token, owner, repo } = cfg()
  return !!(token && owner && repo)
}

async function getFileSHA(filePath: string): Promise<string | null> {
  const { token, owner, repo, branch } = cfg()
  const res = await fetch(
    `${API}/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } },
  )
  if (!res.ok) return null
  const data = await res.json() as { sha: string }
  return data.sha
}

/** Write (create or update) a file in the GitHub repo. */
export async function githubWriteFile(
  filePath: string,
  content: string,
  message: string,
): Promise<void> {
  if (!isConfigured()) {
    // Local dev fallback — write directly to disk
    const abs = path.join(process.cwd(), filePath)
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    fs.writeFileSync(abs, content, 'utf-8')
    return
  }

  const { token, owner, repo, branch } = cfg()
  const sha = await getFileSHA(filePath)
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch,
  }
  if (sha) body.sha = sha

  const res = await fetch(`${API}/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GitHub write failed (${res.status}): ${err}`)
  }
}

/** Delete a file from the GitHub repo. */
export async function githubDeleteFile(filePath: string, message: string): Promise<void> {
  if (!isConfigured()) {
    const abs = path.join(process.cwd(), filePath)
    if (fs.existsSync(abs)) fs.unlinkSync(abs)
    return
  }

  const { token, owner, repo, branch } = cfg()
  const sha = await getFileSHA(filePath)
  if (!sha) throw new Error(`File not found: ${filePath}`)

  const res = await fetch(`${API}/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, sha, branch }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GitHub delete failed (${res.status}): ${err}`)
  }
}
