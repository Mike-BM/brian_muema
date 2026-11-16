/** Small in-memory limiter. Per server instance, so it is a speed bump rather than a hard wall. */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientIp(request: Request): string {
  const h = request.headers;
  return (
    h.get('x-vercel-forwarded-for') ||
    h.get('x-real-ip') ||
    (h.get('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown'
  );
}

/** Returns true if the action is allowed, false if the limit was exceeded. */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= max;
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}
