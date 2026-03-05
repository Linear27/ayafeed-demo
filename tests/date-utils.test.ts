import test from 'node:test';
import assert from 'node:assert/strict';
import { getBusinessDateKey, diffCalendarDays, getRecentWindowCount } from '../services/date';

test('getBusinessDateKey should respect timezone day boundary', () => {
  const now = new Date('2026-03-04T16:30:00.000Z');
  assert.equal(getBusinessDateKey('Asia/Shanghai', now), '2026-03-05');
  assert.equal(getBusinessDateKey('UTC', now), '2026-03-04');
});

test('diffCalendarDays should return whole day difference by date key', () => {
  assert.equal(diffCalendarDays('2026-03-05', '2026-03-05'), 0);
  assert.equal(diffCalendarDays('2026-03-05', '2026-03-06'), 1);
  assert.equal(diffCalendarDays('2026-03-05', '2026-03-01'), -4);
});

test('getRecentWindowCount should count only entries in [0, windowDays)', () => {
  const starts = ['2026-03-05', '2026-03-06', '2026-03-11', '2026-03-12', '2026-03-01'];
  assert.equal(getRecentWindowCount(starts, '2026-03-05', 7), 3);
});
