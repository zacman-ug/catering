import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateQuote } from './quoteEstimator.js';

test('estimateQuote returns UGX range', () => {
  const result = estimateQuote({ eventType: 'Wedding', guestCount: 100, serviceStyle: 'buffet' });
  assert.equal(result.ok, true);
  assert.ok(result.value.minUgx > 0);
  assert.ok(result.value.maxUgx >= result.value.minUgx);
});
