import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeFeatureList } from './features.js';

test('normalizeFeatureList handles arrays and invalid values', () => {
  assert.deepEqual(normalizeFeatureList(['A', '']), ['A']);
  assert.deepEqual(normalizeFeatureList('["Buffet","Plated"]'), ['Buffet', 'Plated']);
  assert.deepEqual(normalizeFeatureList(null), []);
});
