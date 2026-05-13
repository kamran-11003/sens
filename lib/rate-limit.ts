/**
 * Simple in-memory rate limiter for public API routes.
 * Limits each IP to `max` requests per `windowMs` milliseconds.
 * Works in Node.js runtime (not Edge). For Edge, use Upstash Redis.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export function rateLimit(opts: { max: number; windowMs: number }) {
  return function check(ip: string): { allowed: boolean; retryAfter: number } {
    const now = Date.now()
    const entry = store.get(ip)

    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + opts.windowMs })
      return { allowed: true, retryAfter: 0 }
    }

    if (entry.count >= opts.max) {
      return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
    }

    entry.count++
    return { allowed: true, retryAfter: 0 }
  }
}

// Clean up old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 5 * 60 * 1000)
