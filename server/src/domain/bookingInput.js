import {
  isNonEmptyString,
  isOptionalEmail,
  isOptionalPositiveInt,
  isOptionalString,
  trimString,
} from '../utils/guards.js';

const SERVICE_STYLES = new Set(['buffet', 'plated', 'mixed', 'unsure']);
const BUDGET_RANGES = new Set(['under-2m', '2m-5m', '5m-10m', '10m-plus', 'unsure']);

export function parseBookingInput(raw) {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Invalid booking payload' };
  }

  const fullName = trimString(raw.fullName);
  if (!isNonEmptyString(fullName)) {
    return { ok: false, error: 'Full name is required' };
  }

  const phone = trimString(raw.phone);
  if (!isNonEmptyString(phone)) {
    return { ok: false, error: 'Phone number is required' };
  }

  const eventType = trimString(raw.eventType);
  if (!isNonEmptyString(eventType)) {
    return { ok: false, error: 'Event type is required' };
  }

  if (!isOptionalEmail(raw.email)) {
    return { ok: false, error: 'Invalid email address' };
  }

  if (!isOptionalPositiveInt(raw.guestCount)) {
    return { ok: false, error: 'Guest count must be a positive integer' };
  }

  if (!isOptionalString(raw.eventDate)) {
    return { ok: false, error: 'Invalid event date' };
  }

  if (!isOptionalString(raw.venue)) {
    return { ok: false, error: 'Invalid venue' };
  }

  if (!isOptionalString(raw.message)) {
    return { ok: false, error: 'Invalid message' };
  }

  if (!isOptionalString(raw.dietaryRequirements)) {
    return { ok: false, error: 'Invalid dietary requirements' };
  }

  if (!isOptionalString(raw.serviceStyle)) {
    return { ok: false, error: 'Invalid service style' };
  }

  if (!isOptionalString(raw.budgetRange)) {
    return { ok: false, error: 'Invalid budget range' };
  }

  const serviceStyle = trimString(raw.serviceStyle).toLowerCase();
  if (serviceStyle && !SERVICE_STYLES.has(serviceStyle)) {
    return { ok: false, error: 'Invalid service style option' };
  }

  const budgetRange = trimString(raw.budgetRange).toLowerCase();
  if (budgetRange && !BUDGET_RANGES.has(budgetRange)) {
    return { ok: false, error: 'Invalid budget range option' };
  }

  const guestCountRaw = raw.guestCount;
  let guestCount = null;
  if (guestCountRaw !== undefined && guestCountRaw !== null && guestCountRaw !== '') {
    guestCount = typeof guestCountRaw === 'number'
      ? guestCountRaw
      : Number.parseInt(String(guestCountRaw), 10);
  }

  const eventDate = trimString(raw.eventDate);
  if (eventDate && Number.isNaN(Date.parse(eventDate))) {
    return { ok: false, error: 'Invalid event date' };
  }

  return {
    ok: true,
    value: {
      fullName,
      phone,
      eventType,
      email: trimString(raw.email) || null,
      eventDate: eventDate || null,
      guestCount,
      venue: trimString(raw.venue) || null,
      message: trimString(raw.message) || null,
      dietaryRequirements: trimString(raw.dietaryRequirements) || null,
      serviceStyle: serviceStyle || null,
      budgetRange: budgetRange || null,
    },
  };
}

export { SERVICE_STYLES, BUDGET_RANGES };
