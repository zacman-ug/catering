import { trimString } from '../utils/guards.js';

export function buildClientConfirmationEmail({ booking, businessName }) {
  if (!booking || typeof booking !== 'object') {
    return { ok: false, error: 'Booking is required' };
  }

  const email = trimString(booking.email);
  if (!email) {
    return { ok: false, error: 'Client email is not available' };
  }

  const name = trimString(businessName) || 'Chef Godwin Foods and Kitchen Uganda';
  const subject = `We received your catering inquiry — ${name}`;

  const body = [
    `Dear ${trimString(booking.full_name) || 'Client'},`,
    '',
    'Thank you for contacting us. Your catering inquiry has been received.',
    'Our team will review your event details and contact you shortly.',
    '',
    'Summary:',
    `- Event: ${trimString(booking.event_type)}`,
    `- Date: ${booking.event_date || 'To be confirmed'}`,
    `- Guests: ${booking.guest_count ?? 'TBC'}`,
    '',
    'Chef Godwin Foods and Kitchen Uganda',
  ].join('\n');

  return { ok: true, value: { to: email, subject, body } };
}
