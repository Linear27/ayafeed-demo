
import { Suspense, lazy } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { useAppContext } from '@/context/AppContext';
import RouteLoadingFallback from '@/components/RouteLoadingFallback';

const EventDetailView = lazy(() => import('@/views/EventDetailView'));

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/$eventId',
  component: EventDetail,
});

function EventDetail() {
  const { eventId } = Route.useParams();
  const { theme } = useAppContext();
  const navigate = useNavigate();

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <EventDetailView
        id={eventId}
        onBack={() => navigate({ to: '/events' })}
        onSelectCircle={(id) => navigate({ to: '/circles/$circleId', params: { circleId: id } })}
        theme={theme}
      />
    </Suspense>
  );
}
