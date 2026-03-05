import test from 'node:test';
import assert from 'node:assert/strict';
import type { TimelineItem } from '../types';
import { rankHeroItems } from '../services/landingHero';

const mkItem = (overrides: Partial<TimelineItem> & Pick<TimelineItem, 'id' | 'type' | 'date' | 'title'>): TimelineItem => ({
  id: overrides.id,
  type: overrides.type,
  date: overrides.date,
  title: overrides.title,
  location: overrides.location ?? null,
  image: overrides.image ?? null,
  slug: overrides.slug ?? overrides.id,
  isToday: overrides.isToday ?? false,
  isThisWeek: overrides.isThisWeek ?? true,
  marketRegion: overrides.marketRegion ?? null,
  summary: overrides.summary ?? null,
  boothCount: overrides.boothCount,
  organizer: overrides.organizer,
  website: overrides.website,
  status: overrides.status ?? 'UPCOMING',
  featured: overrides.featured,
  featuredOrder: overrides.featuredOrder ?? null,
  originalData: overrides.originalData ?? ({ id: overrides.id } as any),
});

test('rankHeroItems should prioritize featured events above today items', () => {
  const items: TimelineItem[] = [
    mkItem({ id: 'live-today', type: 'live', date: '2026-03-05', title: 'Live Today', isToday: true, status: 'ONGOING' }),
    mkItem({ id: 'event-today', type: 'event', date: '2026-03-05', title: 'Event Today', isToday: true, status: 'ONGOING' }),
    mkItem({ id: 'event-featured', type: 'event', date: '2026-03-06', title: 'Featured Event', featured: true }),
    mkItem({ id: 'event-upcoming', type: 'event', date: '2026-03-07', title: 'Upcoming Event' }),
  ];

  const ranked = rankHeroItems(items);

  assert.deepEqual(ranked.map((item) => item.id), [
    'event-featured',
    'live-today',
    'event-today',
    'event-upcoming',
  ]);
});

test('rankHeroItems should keep today-first behavior when no featured event exists', () => {
  const items: TimelineItem[] = [
    mkItem({ id: 'event-upcoming-a', type: 'event', date: '2026-03-06', title: 'Upcoming A' }),
    mkItem({ id: 'live-today', type: 'live', date: '2026-03-05', title: 'Live Today', isToday: true, status: 'ONGOING' }),
    mkItem({ id: 'event-upcoming-b', type: 'event', date: '2026-03-07', title: 'Upcoming B' }),
  ];

  const ranked = rankHeroItems(items);

  assert.deepEqual(ranked.map((item) => item.id), [
    'live-today',
    'event-upcoming-a',
    'event-upcoming-b',
  ]);
});

test('rankHeroItems should order featured events by featuredOrder asc', () => {
  const items: TimelineItem[] = [
    mkItem({ id: 'event-featured-no-order', type: 'event', date: '2026-03-05', title: 'Featured No Order', featured: true }),
    mkItem({ id: 'event-featured-order-2', type: 'event', date: '2026-03-06', title: 'Featured #2', featured: true, featuredOrder: 2 }),
    mkItem({ id: 'event-featured-order-1', type: 'event', date: '2026-03-07', title: 'Featured #1', featured: true, featuredOrder: 1 }),
    mkItem({ id: 'live-today', type: 'live', date: '2026-03-05', title: 'Live Today', isToday: true, status: 'ONGOING' }),
  ];

  const ranked = rankHeroItems(items);

  assert.deepEqual(ranked.map((item) => item.id), [
    'event-featured-order-1',
    'event-featured-order-2',
    'event-featured-no-order',
    'live-today',
  ]);
});
