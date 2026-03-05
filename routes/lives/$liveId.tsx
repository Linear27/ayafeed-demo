
import { Suspense, lazy } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { useAppContext } from '@/context/AppContext';
import RouteLoadingFallback from '@/components/RouteLoadingFallback';

const LiveDetailView = lazy(() => import('@/views/LiveDetailView'));

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lives/$liveId',
  component: LiveDetail,
});

function LiveDetail() {
  const { liveId } = Route.useParams();
  const { theme } = useAppContext();
  const navigate = useNavigate();

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <LiveDetailView
        id={liveId}
        onBack={() => navigate({ to: '/lives' })}
        theme={theme}
      />
    </Suspense>
  );
}
