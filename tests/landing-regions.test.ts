import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRegionDistribution } from '../services/landingRegions';
import type { TimelineItem } from '../types';

const mkRegionItem = (marketRegion: TimelineItem['marketRegion']): TimelineItem =>
  ({
    id: `id-${marketRegion ?? 'unknown'}`,
    type: 'event',
    date: '2026-03-08',
    title: 'test',
    location: null,
    image: null,
    slug: 'test',
    isToday: false,
    isThisWeek: true,
    marketRegion,
    summary: null,
    status: 'UPCOMING',
    originalData: { id: 'x' } as any,
  }) as TimelineItem;

test('buildRegionDistribution should aggregate known regions and unknown entries', () => {
  const rows = buildRegionDistribution([
    mkRegionItem('JAPAN'),
    mkRegionItem('CN_MAINLAND'),
    mkRegionItem('JAPAN'),
    mkRegionItem('OVERSEAS'),
    mkRegionItem(null),
  ]);

  assert.deepEqual(rows, [
    { key: 'JAPAN', label: '日本 (JAPAN)', count: 2 },
    { key: 'CN_MAINLAND', label: '大陆 (CN_MAINLAND)', count: 1 },
    { key: 'OVERSEAS', label: '海外 (OVERSEAS)', count: 1 },
    { key: 'UNKNOWN', label: '未知 (UNKNOWN)', count: 1 },
  ]);
});

test('buildRegionDistribution should keep unknown runtime region keys with fallback label', () => {
  const rows = buildRegionDistribution([
    mkRegionItem('JAPAN'),
    mkRegionItem('OVERSEAS'),
    mkRegionItem('SOUTHEAST_ASIA' as any),
  ]);

  assert.deepEqual(rows, [
    { key: 'JAPAN', label: '日本 (JAPAN)', count: 1 },
    { key: 'OVERSEAS', label: '海外 (OVERSEAS)', count: 1 },
    { key: 'SOUTHEAST_ASIA', label: '其他 (SOUTHEAST_ASIA)', count: 1 },
  ]);
});
