export function buildWhatsAppUrl({ phone, message }) {
  if (!phone) return { ok: false, error: 'Phone is required' };
  const digits = String(phone).replace(/[^\d+]/g, '').replace(/^\+/, '');
  const text = message ? encodeURIComponent(message) : '';
  return { ok: true, value: `https://wa.me/${digits}${text ? `?text=${text}` : ''}` };
}

export function buildBookingWhatsAppMessage(booking) {
  if (!booking) return { ok: false, error: 'Booking is required' };
  const lines = [
    'Hello Chef Godwin, I would like to book catering.',
    `Name: ${booking.full_name || booking.fullName || ''}`,
    `Event: ${booking.event_type || booking.eventType || ''}`,
    `Date: ${booking.event_date || booking.eventDate || 'TBC'}`,
    `Guests: ${booking.guest_count ?? booking.guestCount ?? 'TBC'}`,
    `Venue: ${booking.venue || 'TBC'}`,
  ];
  return { ok: true, value: lines.join('\n') };
}
