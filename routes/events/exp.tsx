
import { Suspense, lazy } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { useAppContext } from '@/context/AppContext';
import RouteLoadingFallback from '@/components/RouteLoadingFallback';

const EventListExperienceView = lazy(() => import('@/views/EventListExperienceView'));

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/exp',
  component: EventExp,
});

function EventExp() {
  const { theme } = useAppContext();
  const navigate = useNavigate();

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <EventListExperienceView
        onSelect={(id) => navigate({ to: '/events/$eventId', params: { eventId: id } })}
        theme={theme}
        onNavigate={(v) => {
          if (v === 'EVENT_LIST') navigate({ to: '/events' });
        }}
      />
    </Suspense>
  );
}
