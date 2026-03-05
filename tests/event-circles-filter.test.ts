import test from 'node:test';
import assert from 'node:assert/strict';
import type { PublicCircleListItem } from '../types';
import {
  buildEventCircleFilterContext,
  filterEventCircles,
  getEventSpaceBucket,
} from '../services/eventCircles';

const mkCircle = (
  id: string,
  options: {
    title: string;
    penName?: string | null;
    tags?: string[];
    spaceCode?: string;
    products?: Array<{ title?: string; type?: string }>;
  },
): PublicCircleListItem => {
  return {
    id,
    title: options.title,
    slug: id,
    publishedAt: '2026-03-05T00:00:00.000Z',
    isCertified: true,
    organizer: { name: options.penName ?? 'tester', url: null },
    avatar: null,
    penName: options.penName ?? null,
    commissionStatus: 'open',
    classification: null,
    tags: options.tags ?? [],
    ...(options.spaceCode
      ? {
          events: [
            {
              eventId: 'e_test',
              eventName: 'Test Event',
              date: '2026-03-06',
              spaceCode: options.spaceCode,
              status: 'Upcoming',
              products: (options.products ?? []).map((product, index) => ({
                id: `${id}_p${index + 1}`,
                title: product.title ?? `P${index + 1}`,
                price: '¥1000',
                type: product.type ?? 'Regular',
                image: 'https://example.com/p.jpg',
              })),
            },
          ],
        }
      : {}),
  } as PublicCircleListItem;
};

test('getEventSpaceBucket should normalize booth area from spaceCode', () => {
  assert.equal(getEventSpaceBucket('北-01ab'), '北');
  assert.equal(getEventSpaceBucket('A-10'), 'A');
  assert.equal(getEventSpaceBucket('  C  '), 'C');
  assert.equal(getEventSpaceBucket(''), null);
  assert.equal(getEventSpaceBucket(null), null);
});

test('buildEventCircleFilterContext should derive focus and available locations', () => {
  const circles = [
    mkCircle('c_new', {
      title: 'New Circle',
      spaceCode: '北-01ab',
      products: [{ title: '新刊画集', type: 'New' }],
    }),
    mkCircle('c_goods', {
      title: 'Goods Circle',
      spaceCode: 'A-10',
      products: [{ title: '立牌', type: 'Goods' }],
    }),
    mkCircle('c_regular', {
      title: 'Regular Circle',
      spaceCode: 'A-11',
      products: [{ title: '既刊合集', type: 'Regular' }],
    }),
  ];

  const context = buildEventCircleFilterContext(circles, 'e_test');

  assert.deepEqual([...context.availableLocations].sort(), ['A', '北'].sort());
  assert.equal(context.metadataById.get('c_new')?.focus, 'NEW');
  assert.equal(context.metadataById.get('c_goods')?.focus, 'GOODS');
  assert.equal(context.metadataById.get('c_regular')?.focus, 'REGULAR');
});

test('filterEventCircles should apply query, focus and location filters', () => {
  const circles = [
    mkCircle('c1', {
      title: '霜月工房',
      penName: 'Aya',
      tags: ['东方'],
      spaceCode: '北-01ab',
      products: [{ title: '新刊套组', type: 'Set' }],
    }),
    mkCircle('c2', {
      title: '白昼音律',
      penName: 'Niji',
      tags: ['音乐'],
      spaceCode: 'A-10',
      products: [{ title: '立牌', type: 'Goods' }],
    }),
  ];
  const context = buildEventCircleFilterContext(circles, 'e_test');

  const queryFiltered = filterEventCircles(circles, {
    eventId: 'e_test',
    query: 'Aya',
    selectedFocus: [],
    selectedLocations: [],
    metadataById: context.metadataById,
  });
  assert.deepEqual(queryFiltered.map((circle) => circle.id), ['c1']);

  const focusFiltered = filterEventCircles(circles, {
    eventId: 'e_test',
    query: '',
    selectedFocus: ['GOODS'],
    selectedLocations: [],
    metadataById: context.metadataById,
  });
  assert.deepEqual(focusFiltered.map((circle) => circle.id), ['c2']);

  const locationFiltered = filterEventCircles(circles, {
    eventId: 'e_test',
    query: '',
    selectedFocus: [],
    selectedLocations: ['北'],
    metadataById: context.metadataById,
  });
  assert.deepEqual(locationFiltered.map((circle) => circle.id), ['c1']);
});
