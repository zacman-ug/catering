import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBookingNotification, isSmtpConfigured } from './emailNotification.js';

test('buildBookingNotification requires notify email', () => {
  const result = buildBookingNotification({
    booking: { full_name: 'Jane', event_type: 'Wedding' },
    notifyEmail: '',
    businessName: 'Chef Godwin',
  });
  assert.equal(result.ok, false);
});

test('buildBookingNotification builds subject and body', () => {
  const result = buildBookingNotification({
    booking: {
      full_name: 'Jane',
      phone: '+2567',
      event_type: 'Wedding',
      guest_count: 100,
    },
    notifyEmail: 'bookings@example.com',
    businessName: 'Chef Godwin',
  });

  assert.equal(result.ok, true);
  assert.match(result.value.subject, /Wedding/);
  assert.match(result.value.body, /Jane/);
});

test('isSmtpConfigured checks env keys', () => {
  assert.equal(isSmtpConfigured({ SMTP_HOST: 'smtp.example.com', SMTP_USER: 'user' }), true);
  assert.equal(isSmtpConfigured({ SMTP_HOST: 'smtp.example.com' }), false);
});
