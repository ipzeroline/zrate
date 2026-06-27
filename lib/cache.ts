/**
 * Lightweight in-memory TTL cache for serverless environments.
 * - Resets on cold start (no persistence needed for rate data)
 * - Deduplicates concurrent fetches for the same key
 * - Zero dependencies
 */

interface CacheEntry<T> {
  data: T
  expiresAt: number
  lastAccessed: number
}

const MAX_ENTRIES = Math.max(16, Number(process.env.IN_MEMORY_CACHE_MAX_ENTRIES || 128))

// Shared across all requests within the same serverless instance
const store = new Map<string, CacheEntry<unknown>>()

// Track in-flight promises to deduplicate concurrent fetches
const inFlight = new Map<string, Promise<unknown>>()

function prune(now: number) {
  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) {
      store.delete(key)
    }
  }

  while (store.size > MAX_ENTRIES) {
    let oldestKey: string | undefined
    let oldestAccess = Infinity

    for (const [key, entry] of store) {
      if (entry.lastAccessed < oldestAccess) {
        oldestKey = key
        oldestAccess = entry.lastAccessed
      }
    }

    if (!oldestKey) return
    store.delete(oldestKey)
  }
}

export async function cached<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now()

  // 1. Check if valid cached
  const entry = store.get(key) as CacheEntry<T> | undefined
  if (entry && entry.expiresAt > now) {
    entry.lastAccessed = now
    return entry.data
  }
  if (entry) {
    store.delete(key)
  }

  // 2. Deduplicate: if another request is already fetching this key, wait for it
  const pending = inFlight.get(key) as Promise<T> | undefined
  if (pending) {
    return pending
  }

  // 3. Fetch fresh data
  const promise = fetcher()
    .then(data => {
      const refreshedAt = Date.now()
      store.set(key, { data, expiresAt: refreshedAt + ttlMs, lastAccessed: refreshedAt })
      prune(refreshedAt)
      inFlight.delete(key)
      return data
    })
    .catch(err => {
      inFlight.delete(key)
      // Return stale data if available, otherwise throw
      const stale = store.get(key) as CacheEntry<T> | undefined
      if (stale) {
        console.warn(`Cache fetch failed for "${key}", serving stale data:`, err)
        return stale.data
      }
      throw err
    })

  inFlight.set(key, promise)
  return promise
}

/** Manually invalidate a cache key */
export function invalidate(key: string): void {
  store.delete(key)
}

/** Get remaining TTL in ms, or 0 if not cached */
export function ttl(key: string): number {
  const entry = store.get(key)
  if (!entry) return 0
  return Math.max(0, entry.expiresAt - Date.now())
}
