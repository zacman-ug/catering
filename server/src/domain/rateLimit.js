/**
 * Pure rate-limit decision — easy to unit test.
 */
export function shouldAllowRequest(timestamps, now, windowMs, maxRequests) {
  if (!Array.isArray(timestamps)) {
    return { ok: false, error: 'Invalid timestamps' };
  }
  if (typeof now !== 'number' || Number.isNaN(now)) {
    return { ok: false, error: 'Invalid now' };
  }
  if (typeof windowMs !== 'number' || windowMs < 1) {
    return { ok: false, error: 'Invalid windowMs' };
  }
  if (typeof maxRequests !== 'number' || maxRequests < 1) {
    return { ok: false, error: 'Invalid maxRequests' };
  }

  const windowStart = now - windowMs;
  const recent = timestamps.filter((t) => typeof t === 'number' && t >= windowStart);
  if (recent.length >= maxRequests) {
    return { ok: true, allowed: false, retryAfterMs: recent[0] + windowMs - now };
  }
  return { ok: true, allowed: true, retryAfterMs: 0 };
}

export function pruneTimestamps(timestamps, now, windowMs) {
  if (!Array.isArray(timestamps)) return [];
  const windowStart = now - windowMs;
  return timestamps.filter((t) => typeof t === 'number' && t >= windowStart);
}
