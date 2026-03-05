import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchCircles } from '../services/api';

const mkCircleItem = (id: string) => ({
  id,
  title: `Circle ${id}`,
  slug: id,
  publishedAt: '2026-03-05T00:00:00.000Z',
  isCertified: true,
  organizer: { name: 'Tester', url: null },
  avatar: null,
  penName: null,
  commissionStatus: 'open' as const,
  classification: null,
  tags: [],
});

test('fetchCircles should aggregate all pages when page is not specified', async (t) => {
  const originalFetch = globalThis.fetch;
  const calls: string[] = [];

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const rawUrl = typeof input === 'string' ? input : input.toString();
    calls.push(rawUrl);
    const url = new URL(rawUrl, 'http://localhost');
    const page = Number(url.searchParams.get('page') ?? '1');
    const allItems = [mkCircleItem('c1'), mkCircleItem('c2'), mkCircleItem('c3')];
    // Intentionally return partial first page to verify caller follows pageInfo.total.
    const items = page === 1 ? allItems.slice(0, 2) : allItems.slice(2);

    return new Response(
      JSON.stringify({
        items,
        pageInfo: {
          page,
          pageSize: 2,
          total: allItems.length,
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

  const circles = await fetchCircles();

  assert.equal(circles.length, 3);
  assert.deepEqual(
    circles.map((circle) => circle.id),
    ['c1', 'c2', 'c3'],
  );
  assert.equal(calls.length, 2);
});
