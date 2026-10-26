import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampLimit,
  clampOffset,
  isNonEmptyString,
  isOptionalEmail,
  isOptionalPositiveInt,
  normalizeStringArray,
} from './guards.js';

test('isNonEmptyString rejects blank values', () => {
  assert.equal(isNonEmptyString(''), false);
  assert.equal(isNonEmptyString('  '), false);
  assert.equal(isNonEmptyString('Chef'), true);
});

test('isOptionalEmail validates only when provided', () => {
  assert.equal(isOptionalEmail(''), true);
  assert.equal(isOptionalEmail('bad-email'), false);
  assert.equal(isOptionalEmail('chef@example.com'), true);
});

test('isOptionalPositiveInt accepts positive integers', () => {
  assert.equal(isOptionalPositiveInt('25'), true);
  assert.equal(isOptionalPositiveInt(0), false);
  assert.equal(isOptionalPositiveInt(undefined), true);
});

test('clampLimit and clampOffset enforce bounds', () => {
  assert.equal(clampLimit(undefined), 50);
  assert.equal(clampLimit(999), 100);
  assert.equal(clampOffset(-3), 0);
});

test('normalizeStringArray filters invalid entries', () => {
  assert.deepEqual(normalizeStringArray([' Kampala ', '', 3, 'Wakiso']), ['Kampala', 'Wakiso']);
});
