import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMapsEmbedUrl, normalizeBusinessInfo } from './businessInfo.js';

test('normalizeBusinessInfo returns null for invalid input', () => {
  assert.equal(normalizeBusinessInfo(null), null);
});

test('normalizeBusinessInfo sanitizes faqs and service areas', () => {
  const info = normalizeBusinessInfo({
    name: 'Chef Godwin',
    faqs: [{ question: 'Q?', answer: 'A.' }, { question: '', answer: 'x' }],
    serviceAreas: ['Kampala', ''],
  });

  assert.equal(info.faqs.length, 1);
  assert.deepEqual(info.serviceAreas, ['Kampala']);
});

test('buildMapsEmbedUrl uses coordinates when available', () => {
  const url = buildMapsEmbedUrl({ lat: 0.29, lng: 32.52 }, 'Kampala');
  assert.match(url, /0\.29,32\.52/);
});
