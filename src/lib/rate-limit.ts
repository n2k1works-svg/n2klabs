/**
 * Simple in-memory rate limiter for API routes.
 *
 * On Vercel serverless, each invocation may have its own memory, so this is
 * a "best effort" limiter — it won't stop a distributed attack, but it WILL
 * stop:
 *   - A single user spamming the contact form
 *   - Brute-force login attempts from one IP
 *   - Accidental infinite loops in client code
 *
 * For serious production traffic, upgrade to @upstash/ratelimit + Redis.
 * For a small agency site, this is sufficient.
 *
 * Usage:
 *   const ok = await rateLimit(req, { namespace: "login", limit: 5, windowMs: 60_000 });
 *   if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

// Clean up expired buckets every 5 minutes to prevent memory growth
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

function getClientIp(req: Request): string {
  // Vercel sets x-forwarded-for; Caddy sets x-real-ip
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri;
  return "unknown";
}

export async function rateLimit(
  req: Request,
  opts: { namespace: string; limit: number; windowMs: number },
): Promise<boolean> {
  cleanup();
  const ip = getClientIp(req);
  const key = `${opts.namespace}:${ip}`;
  const now = Date.now();

  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return true;
  }

  existing.count += 1;
  if (existing.count > opts.limit) {
    return false;
  }

  return true;
}

/** Rate limit configs for each endpoint. */
export const RATE_LIMITS = {
  login: { namespace: "login", limit: 5, windowMs: 60_000 }, // 5 attempts/min
  contact: { namespace: "contact", limit: 3, windowMs: 60_000 }, // 3 submissions/min
  upload: { namespace: "upload", limit: 10, windowMs: 60_000 }, // 10 uploads/min
} as const;
