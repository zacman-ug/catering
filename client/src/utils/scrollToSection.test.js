import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeScrollTop,
  normalizeSectionId,
  splitPathAndHash,
} from './scrollToSection.js';

test('normalizeSectionId strips hash and whitespace', () => {
  assert.equal(normalizeSectionId('#booking-form'), 'booking-form');
  assert.equal(normalizeSectionId('  '), '');
});

test('splitPathAndHash parses route targets', () => {
  assert.deepEqual(splitPathAndHash('/book#booking-form'), {
    pathname: '/book',
    hash: 'booking-form',
  });
  assert.deepEqual(splitPathAndHash('/catering'), {
    pathname: '/catering',
    hash: '',
  });
});

test('computeScrollTop accounts for header offset', () => {
  const element = {
    getBoundingClientRect: () => ({ top: 200 }),
  };

  assert.equal(computeScrollTop(element, 88, 100), 212);
});
