/**
 * Pure guard helpers — return { ok: true, value } or { ok: false, error }.
 */

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isOptionalString(value) {
  if (value === undefined || value === null) return true;
  return typeof value === 'string';
}

export function isOptionalEmail(value) {
  if (value === undefined || value === null || value === '') return true;
  if (typeof value !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isOptionalUuid(value) {
  if (value === undefined || value === null || value === '') return true;
  if (typeof value !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.trim());
}

export function isOptionalPositiveInt(value) {
  if (value === undefined || value === null || value === '') return true;
  if (typeof value === 'number') return Number.isInteger(value) && value >= 1;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number.parseInt(value, 10);
    return Number.isInteger(n) && n >= 1;
  }
  return false;
}

export function trimString(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

export function clampLimit(value, defaultLimit = 50, maxLimit = 100) {
  if (value === undefined || value === null || value === '') {
    return defaultLimit;
  }
  const n = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  if (!Number.isInteger(n) || n < 1) return defaultLimit;
  return Math.min(n, maxLimit);
}

export function clampOffset(value) {
  if (value === undefined || value === null || value === '') return 0;
  const n = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  if (!Number.isInteger(n) || n < 0) return 0;
  return n;
}

export function normalizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}
