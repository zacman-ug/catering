import test from 'node:test';
import assert from 'node:assert/strict';
import { pruneTimestamps, shouldAllowRequest } from './rateLimit.js';

test('shouldAllowRequest blocks when max exceeded', () => {
  const now = 10_000;
  const timestamps = [9_500, 9_700, 9_900];
  const decision = shouldAllowRequest(timestamps, now, 1_000, 3);
  assert.equal(decision.ok, true);
  assert.equal(decision.allowed, false);
});

test('shouldAllowRequest allows under limit', () => {
  const decision = shouldAllowRequest([9_900], 10_000, 1_000, 3);
  assert.equal(decision.allowed, true);
});

test('pruneTimestamps removes stale entries', () => {
  const pruned = pruneTimestamps([100, 8_500, 9_500], 10_000, 1_000);
  assert.deepEqual(pruned, [9_500]);
});
