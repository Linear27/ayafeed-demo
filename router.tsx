
import { createRouter } from '@tanstack/react-router';
import { Route as rootRoute } from './routes/__root';
import { Route as indexRoute } from './routes/index';
import { Route as eventsIndexRoute } from './routes/events/index';
import { Route as eventDetailRoute } from './routes/events/$eventId';
import { Route as livesIndexRoute } from './routes/lives/index';
import { Route as liveDetailRoute } from './routes/lives/$liveId';
import { Route as circlesIndexRoute } from './routes/circles/index';
import { Route as circleDetailRoute } from './routes/circles/$circleId';
import { Route as showcaseRoute } from './routes/showcase';
import { Route as eventExpRoute } from './routes/events/exp';
import { Route as landingExpRoute } from './routes/landing-exp';
import { Route as privacyRoute } from './routes/privacy';
import { Route as feedbackRoute } from './routes/feedback';

const routeTree = rootRoute.addChildren([
  indexRoute,
  eventsIndexRoute,
  eventDetailRoute,
  livesIndexRoute,
  liveDetailRoute,
  circlesIndexRoute,
  circleDetailRoute,
  showcaseRoute,
  eventExpRoute,
  landingExpRoute,
  privacyRoute,
  feedbackRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
