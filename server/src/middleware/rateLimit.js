import { AppError } from './errorHandler.js';
import { pruneTimestamps, shouldAllowRequest } from '../domain/rateLimit.js';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_POSTS = 30;
const store = new Map();

function getClientKey(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || 'unknown';
}

export function rateLimitPosts(req, _res, next) {
  const key = getClientKey(req);
  const now = Date.now();
  const existing = store.get(key) || [];
  const pruned = pruneTimestamps(existing, now, WINDOW_MS);
  const decision = shouldAllowRequest(pruned, now, WINDOW_MS, MAX_POSTS);

  if (!decision.ok) {
    return next(new AppError('Rate limit error', 500));
  }

  if (!decision.allowed) {
    return next(new AppError('Too many requests. Please try again later.', 429));
  }

  pruned.push(now);
  store.set(key, pruned);
  next();
}
