import test from 'node:test';
import assert from 'node:assert/strict';
import type { TimelineItem } from '../types';
import { buildLandingHomepageModel } from '../services/landingHomepage';

const makeItem = (
  overrides: Partial<TimelineItem> & Pick<TimelineItem, 'id' | 'type' | 'date' | 'title'>,
): TimelineItem => ({
  id: overrides.id,
  type: overrides.type,
  date: overrides.date,
  title: overrides.title,
  location: overrides.location ?? null,
  image: overrides.image ?? null,
  slug: overrides.slug ?? overrides.id,
  isToday: overrides.isToday ?? false,
  isThisWeek: overrides.isThisWeek ?? false,
  marketRegion: overrides.marketRegion ?? 'JAPAN',
  summary: overrides.summary ?? null,
  status: overrides.status ?? 'UPCOMING',
  originalData: overrides.originalData ?? ({ id: overrides.id } as any),
  boothCount: overrides.boothCount,
  organizer: overrides.organizer,
  website: overrides.website,
  featured: overrides.featured,
  featuredOrder: overrides.featuredOrder ?? null,
});

test('buildLandingHomepageModel should expose hero, focus, monthly, updates and preview collections', () => {
  const model = buildLandingHomepageModel(
    [
      makeItem({ id: 'featured-a', type: 'event', date: '2026-04-12', title: 'Featured A', featured: true, isThisWeek: true }),
      makeItem({ id: 'focus-b', type: 'event', date: '2026-04-20', title: 'Focus B', isThisWeek: true }),
      makeItem({ id: 'preview-c', type: 'live', date: '2026-05-01', title: 'Preview C' }),
      makeItem({ id: 'preview-d', type: 'event', date: '2026-05-04', title: 'Preview D' }),
    ],
    '2026-03-06',
  );

  assert.equal(model.hero.main?.id, 'featured-a');
  assert.ok(model.focusItems.length >= 1);
  assert.ok(model.monthlyHighlights.length >= 1);
  assert.ok(model.timelinePreview.length >= 1);
  assert.ok(model.quickRail.nextMajor);
});
