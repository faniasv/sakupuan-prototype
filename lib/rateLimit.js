import { HttpError } from "./http";

// Fixed-window limiter. In-memory => per server instance only.
// On Vercel (serverless) swap for Upstash/Redis before relying on it.
const buckets = (globalThis.__sakupuanRate ??= new Map());

export function rateLimit(key, { limit = 20, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return;
  }
  b.count += 1;
  if (b.count > limit) {
    throw new HttpError(429, "Terlalu banyak permintaan, coba lagi sebentar lagi");
  }
}
