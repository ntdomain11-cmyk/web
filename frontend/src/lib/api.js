import { API_BASE_URL } from './config'

const inflight = new Map()
const cache = new Map()

let pendingCount = 0
const pendingListeners = new Set()

function notifyPending() {
  for (const cb of pendingListeners) cb(pendingCount)
}

function incPending() {
  pendingCount += 1
  notifyPending()
}

function decPending() {
  pendingCount = Math.max(0, pendingCount - 1)
  notifyPending()
}

export function subscribeApiPending(cb) {
  pendingListeners.add(cb)
  cb(pendingCount)
  return () => pendingListeners.delete(cb)
}

export function getApiPendingCount() {
  return pendingCount
}

export function clearApiCache() {
  inflight.clear()
  cache.clear()
}

export async function apiGet(path) {
  const url = `${API_BASE_URL}${path}`

  if (cache.has(url)) {
    return cache.get(url)
  }

  if (inflight.has(url)) {
    return inflight.get(url)
  }

  incPending()
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
    decPending()
  }
}

export async function apiPost(path, body) {
  const url = `${API_BASE_URL}${path}`
  incPending()
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body ?? {}),
    })

    const data = await res.json().catch(() => null)
    if (!res.ok) {
      const msg = data?.error || data?.message || 'Request failed'
      throw new Error(msg)
    }
    return data
  } finally {
    decPending()
  }
}
