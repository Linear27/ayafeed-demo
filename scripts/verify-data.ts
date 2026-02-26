import { EVENTS, LIVES, CIRCLES } from '../data';

type CheckFailure = {
  kind: string;
  id: string;
  detail: string;
};

const today = new Date().toISOString().slice(0, 10);
const failures: CheckFailure[] = [];

const ensure = (condition: boolean, failure: CheckFailure) => {
  if (!condition) failures.push(failure);
};

for (const event of EVENTS) {
  ensure(Boolean(event.image), { kind: 'event', id: event.id, detail: 'missing image' });
  ensure(Array.isArray(event.news) && event.news.length > 0, { kind: 'event', id: event.id, detail: 'missing news' });
  const docs = (event.docs || {}) as { attendee?: unknown[]; circle?: unknown[] };
  ensure(Array.isArray(docs.attendee) && docs.attendee.length > 0, { kind: 'event', id: event.id, detail: 'missing attendee docs' });
  ensure(Array.isArray(docs.circle) && docs.circle.length > 0, { kind: 'event', id: event.id, detail: 'missing circle docs' });
  ensure(Array.isArray(event.floorMapImages) && event.floorMapImages.length > 0, { kind: 'event', id: event.id, detail: 'missing floor map images' });
  ensure(Array.isArray(event.venueCoordinates) && event.venueCoordinates.length === 2, { kind: 'event', id: event.id, detail: 'missing venue coordinates' });
  const circleCount = CIRCLES.filter((circle) => circle.events.some((entry) => entry.eventId === event.id)).length;
  ensure(circleCount > 0, { kind: 'event', id: event.id, detail: 'missing associated circles' });
}

const upcomingEventCount = EVENTS.filter((event) => event.date >= today).length;
const upcomingLiveCount = LIVES.filter((live) => live.date >= today).length;

ensure(upcomingEventCount > 0, {
  kind: 'dataset',
  id: 'events',
  detail: `no upcoming events for ${today}`,
});
ensure(upcomingLiveCount > 0, {
  kind: 'dataset',
  id: 'lives',
  detail: `no upcoming lives for ${today}`,
});

const imageUrls = [
  ...EVENTS.map((event) => ({ id: event.id, type: 'event', url: event.image })),
  ...LIVES.map((live) => ({ id: live.id, type: 'live', url: live.image })),
];

const checkImage = async (item: { id: string; type: string; url: string }) => {
  try {
    const response = await fetch(item.url, { method: 'HEAD', redirect: 'follow' });
    if (!response.ok) {
      failures.push({
        kind: item.type,
        id: item.id,
        detail: `image not reachable (status=${response.status}) ${item.url}`,
      });
    }
  } catch (error) {
    failures.push({
      kind: item.type,
      id: item.id,
      detail: `image request failed ${item.url}`,
    });
  }
};

await Promise.all(imageUrls.map((item) => checkImage(item)));

if (failures.length > 0) {
  console.error(`verify-data failed with ${failures.length} issue(s):`);
  for (const failure of failures) {
    console.error(`- [${failure.kind}] ${failure.id}: ${failure.detail}`);
  }
  process.exit(1);
}

console.log('verify-data passed');
console.log(`events=${EVENTS.length} (upcoming=${upcomingEventCount}), lives=${LIVES.length} (upcoming=${upcomingLiveCount}), circles=${CIRCLES.length}`);
