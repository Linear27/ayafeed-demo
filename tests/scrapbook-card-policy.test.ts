import test from 'node:test';
import assert from 'node:assert/strict';
import { getScrapbookCardInteractionPolicy } from '../services/scrapbookCardPolicy';
import type { TimelineItem } from '../types';

const mkScenario = (overrides: Partial<Pick<TimelineItem, 'isToday' | 'isThisWeek' | 'type'>>) => ({
  isToday: overrides.isToday ?? false,
  isThisWeek: overrides.isThisWeek ?? false,
  type: overrides.type ?? 'event',
});

test('ScrapbookCard interaction policy should keep title as main link for today items', () => {
  const policy = getScrapbookCardInteractionPolicy(mkScenario({ isToday: true, isThisWeek: true }));
  assert.deepEqual(policy, {
    clickableContainer: false,
    primaryCta: 'title-link',
  });
});

test('ScrapbookCard interaction policy should keep title as main link for this-week items', () => {
  const policy = getScrapbookCardInteractionPolicy(mkScenario({ isToday: false, isThisWeek: true }));
  assert.deepEqual(policy, {
    clickableContainer: false,
    primaryCta: 'title-link',
  });
});

test('ScrapbookCard interaction policy should keep title as main link for upcoming items', () => {
  const policy = getScrapbookCardInteractionPolicy(mkScenario({ isToday: false, isThisWeek: false }));
  assert.deepEqual(policy, {
    clickableContainer: false,
    primaryCta: 'title-link',
  });
});
