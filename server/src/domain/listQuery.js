import { clampLimit, clampOffset, trimString } from '../utils/guards.js';

const BOOKING_STATUSES = new Set(['pending', 'confirmed', 'declined', 'completed']);
const ENROLLMENT_STATUSES = new Set(['pending', 'confirmed', 'declined', 'completed']);

export function parseListQuery(raw, { allowedStatuses = null } = {}) {
  if (raw === undefined || raw === null) {
    raw = {};
  }
  if (typeof raw !== 'object') {
    return { ok: false, error: 'Invalid list query' };
  }

  const status = trimString(raw.status);
  if (status && allowedStatuses && !allowedStatuses.has(status)) {
    return { ok: false, error: 'Invalid status filter' };
  }

  return {
    ok: true,
    value: {
      status: status || undefined,
      limit: clampLimit(raw.limit),
      offset: clampOffset(raw.offset),
    },
  };
}

export function parseBookingStatusUpdate(raw) {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Invalid status payload' };
  }
  const status = trimString(raw.status);
  if (!BOOKING_STATUSES.has(status)) {
    return { ok: false, error: 'Invalid booking status' };
  }
  return { ok: true, value: { status } };
}

export function parseEnrollmentStatusUpdate(raw) {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Invalid status payload' };
  }
  const status = trimString(raw.status);
  if (!ENROLLMENT_STATUSES.has(status)) {
    return { ok: false, error: 'Invalid enrollment status' };
  }
  return { ok: true, value: { status } };
}

export function parseUuidParam(id) {
  const value = trimString(id);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    return { ok: false, error: 'Invalid ID' };
  }
  return { ok: true, value };
}

export { BOOKING_STATUSES, ENROLLMENT_STATUSES };
