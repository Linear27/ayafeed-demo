import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchEvents, fetchLives } from '../services/api';

const mkEventItem = (id: string) => ({
  id,
  slug: id,
  kind: 'event' as const,
  eventSeriesKey: id,
  posterOrientation: 'portrait' as const,
  startAt: '2026-03-06T00:00:00Z',
  endAt: '2026-03-06T23:59:59Z',
  title: `Event ${id}`,
  summary: null,
  location: null,
  marketRegion: 'JAPAN' as const,
  poster: null,
  displayLocale: 'zh',
  fallbackUsed: false,
  counts: { touhouEvents: 0 },
  events: [{ id, slug: id, title: `Event ${id}` }],
  genres: [],
  boothCount: 0,
});

const mkLiveItem = (id: string) => ({
  id,
  slug: id,
  startAt: '2026-03-06T18:00:00Z',
  endAt: '2026-03-06T21:00:00Z',
  title: `Live ${id}`,
  description: null,
  location: null,
  venue: null,
  poster: null,
  marketRegion: 'JAPAN' as const,
});

test('fetchEvents should aggregate all pages when page is not specified', async (t) => {
  const originalFetch = globalThis.fetch;
  const calls: string[] = [];

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const rawUrl = typeof input === 'string' ? input : input.toString();
    calls.push(rawUrl);
    const url = new URL(rawUrl, 'http://localhost');
    const page = Number(url.searchParams.get('page') ?? '1');
    const all = [mkEventItem('e1'), mkEventItem('e2'), mkEventItem('e3')];
    const items = page === 1 ? all.slice(0, 2) : all.slice(2);

    return new Response(
      JSON.stringify({
        items,
        pageInfo: {
          page,
          pageSize: Number(url.searchParams.get('pageSize') ?? '20'),
          total: all.length,
        },
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );
  }) as typeof fetch;

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const items = await fetchEvents({ marketRegion: 'JAPAN' }, { forceRefresh: true });
  assert.deepEqual(items.map((item) => item.id), ['e1', 'e2', 'e3']);
  assert.equal(calls.length, 2);
});

test('fetchLives should aggregate all pages when page is not specified', async (t) => {
  const originalFetch = globalThis.fetch;
  const calls: string[] = [];

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const rawUrl = typeof input === 'string' ? input : input.toString();
    calls.push(rawUrl);
    const url = new URL(rawUrl, 'http://localhost');
    const page = Number(url.searchParams.get('page') ?? '1');
    const all = [mkLiveItem('l1'), mkLiveItem('l2'), mkLiveItem('l3')];
    const items = page === 1 ? all.slice(0, 1) : all.slice(1);

    return new Response(
      JSON.stringify({
        items,
        pageInfo: {
          page,
          pageSize: Number(url.searchParams.get('pageSize') ?? '20'),
          total: all.length,
        },
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );
  }) as typeof fetch;

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const items = await fetchLives({}, { forceRefresh: true });
  assert.deepEqual(items.map((item) => item.id), ['l1', 'l2', 'l3']);
  assert.equal(calls.length, 2);
});
