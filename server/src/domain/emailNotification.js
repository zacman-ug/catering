import { trimString } from '../utils/guards.js';

export function buildBookingNotification({ booking, notifyEmail, businessName }) {
  if (!booking || typeof booking !== 'object') {
    return { ok: false, error: 'Booking is required' };
  }

  const to = trimString(notifyEmail);
  if (!to) {
    return { ok: false, error: 'Notification email is not configured' };
  }

  const name = trimString(businessName) || 'Chef Godwin';
  const subject = `[${name}] New catering inquiry — ${trimString(booking.event_type) || 'Event'}`;

  const lines = [
    'New catering booking inquiry',
    '',
    `Name: ${trimString(booking.full_name)}`,
    `Phone: ${trimString(booking.phone)}`,
    `Email: ${trimString(booking.email) || '—'}`,
    `Event type: ${trimString(booking.event_type)}`,
    `Event date: ${booking.event_date || '—'}`,
    `Guests: ${booking.guest_count ?? '—'}`,
    `Venue: ${trimString(booking.venue) || '—'}`,
    `Service style: ${trimString(booking.service_style) || '—'}`,
    `Budget range: ${trimString(booking.budget_range) || '—'}`,
    `Dietary requirements: ${trimString(booking.dietary_requirements) || '—'}`,
    '',
    'Message:',
    trimString(booking.message) || '—',
  ];

  return {
    ok: true,
    value: {
      to,
      subject,
      body: lines.join('\n'),
    },
  };
}

export function isSmtpConfigured(env) {
  if (!env || typeof env !== 'object') return false;
  const host = trimString(env.SMTP_HOST);
  const user = trimString(env.SMTP_USER);
  return Boolean(host && user);
}
