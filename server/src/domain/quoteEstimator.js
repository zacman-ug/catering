import { trimString } from '../utils/guards.js';

const BASE_RATES_UGX = {
  wedding: { perGuest: 35000, minimum: 2000000 },
  'introduction / kwanjula': { perGuest: 30000, minimum: 1500000 },
  birthday: { perGuest: 25000, minimum: 800000 },
  graduation: { perGuest: 25000, minimum: 900000 },
  'corporate event': { perGuest: 28000, minimum: 1200000 },
  'house party': { perGuest: 22000, minimum: 600000 },
  'religious / dua': { perGuest: 24000, minimum: 700000 },
  other: { perGuest: 26000, minimum: 800000 },
};

const SERVICE_STYLE_MULTIPLIER = {
  buffet: 1,
  plated: 1.15,
  mixed: 1.08,
  unsure: 1,
};

export function estimateQuote({ eventType, guestCount, serviceStyle }) {
  if (!eventType || typeof eventType !== 'string') {
    return { ok: false, error: 'Event type is required' };
  }

  const guests = typeof guestCount === 'number' ? guestCount : Number.parseInt(String(guestCount || 0), 10);
  if (!Number.isInteger(guests) || guests < 1) {
    return { ok: false, error: 'Guest count must be at least 1' };
  }

  const key = trimString(eventType).toLowerCase();
  const rate = BASE_RATES_UGX[key] || BASE_RATES_UGX.other;
  const styleKey = trimString(serviceStyle || 'unsure').toLowerCase();
  const multiplier = SERVICE_STYLE_MULTIPLIER[styleKey] ?? 1;

  const rawMin = Math.round(rate.perGuest * guests * multiplier * 0.9);
  const rawMax = Math.round(rate.perGuest * guests * multiplier * 1.15);

  const minUgx = Math.max(rate.minimum, rawMin);
  const maxUgx = Math.max(minUgx, rawMax);

  return {
    ok: true,
    value: {
      eventType,
      guestCount: guests,
      serviceStyle: styleKey || 'unsure',
      minUgx,
      maxUgx,
      disclaimer: 'Estimate only — final quote confirmed after menu planning and venue review.',
    },
  };
}
