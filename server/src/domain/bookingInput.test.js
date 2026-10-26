import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBookingInput } from './bookingInput.js';

test('parseBookingInput requires core fields', () => {
  const result = parseBookingInput({});
  assert.equal(result.ok, false);
});

test('parseBookingInput accepts valid payload', () => {
  const result = parseBookingInput({
    fullName: 'Jane Doe',
    phone: '+256700000000',
    eventType: 'Wedding',
    guestCount: '120',
    serviceStyle: 'buffet',
    budgetRange: '5m-10m',
    dietaryRequirements: 'No pork',
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.fullName, 'Jane Doe');
  assert.equal(result.value.guestCount, 120);
  assert.equal(result.value.serviceStyle, 'buffet');
});

test('parseBookingInput rejects invalid service style', () => {
  const result = parseBookingInput({
    fullName: 'Jane',
    phone: '123',
    eventType: 'Wedding',
    serviceStyle: 'invalid',
  });
  assert.equal(result.ok, false);
});
