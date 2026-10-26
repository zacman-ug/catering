import { trimString } from '../utils/guards.js';

export function buildWhatsAppUrl({ phone, message }) {
  const normalizedPhone = trimString(phone).replace(/[^\d+]/g, '');
  if (!normalizedPhone) {
    return { ok: false, error: 'Phone is required' };
  }

  const digits = normalizedPhone.startsWith('+')
    ? normalizedPhone.slice(1)
    : normalizedPhone;

  const text = trimString(message);
  const query = text ? `?text=${encodeURIComponent(text)}` : '';

  return {
    ok: true,
    value: `https://wa.me/${digits}${query}`,
  };
}

export function buildBookingWhatsAppMessage(booking) {
  if (!booking || typeof booking !== 'object') {
    return { ok: false, error: 'Booking is required' };
  }

  const lines = [
    'Hello Chef Godwin, I would like to book catering.',
    `Name: ${trimString(booking.full_name || booking.fullName)}`,
    `Event: ${trimString(booking.event_type || booking.eventType)}`,
    `Date: ${booking.event_date || booking.eventDate || 'TBC'}`,
    `Guests: ${booking.guest_count ?? booking.guestCount ?? 'TBC'}`,
    `Venue: ${trimString(booking.venue) || 'TBC'}`,
  ];

  return { ok: true, value: lines.join('\n') };
}
