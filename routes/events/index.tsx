
import { Suspense, lazy } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { useAppContext } from '@/context/AppContext';
import RouteLoadingFallback from '@/components/RouteLoadingFallback';

const EventListView = lazy(() => import('@/views/EventListView'));

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: EventsIndex,
});

function EventsIndex() {
  const { language, region } = useAppContext();
  const navigate = useNavigate();

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <EventListView
        onSelect={(id) => navigate({ to: '/events/$eventId', params: { eventId: id } })}
        userLanguage={language}
        activeRegion={region}
      />
    </Suspense>
  );
}
