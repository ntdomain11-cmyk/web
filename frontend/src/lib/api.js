import { API_BASE_URL } from './config'

const inflight = new Map()
const cache = new Map()

export function clearApiCache() {
  inflight.clear()
  cache.clear()
}

export async function apiPost(path, body) {
  const url = `${API_BASE_URL}${path}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = data?.error || data?.message || 'Request failed'
    throw new Error(msg)
  }
  return data
}

export async function apiGet(path) {
  const url = `${API_BASE_URL}${path}`

  if (cache.has(url)) {
    return cache.get(url)
  }

  if (inflight.has(url)) {
    return inflight.get(url)
  }

  const p = (async () => {
    const res = await fetch(url)
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      const msg = data?.error || data?.message || 'Request failed'
      throw new Error(msg)
    }
    cache.set(url, data)
    return data
  })()

  inflight.set(url, p)

  try {
    return await p
  } finally {
    inflight.delete(url)
  }
}
