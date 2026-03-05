
import { Suspense, lazy } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { useAppContext } from '@/context/AppContext';
import RouteLoadingFallback from '@/components/RouteLoadingFallback';

const LiveListView = lazy(() => import('@/views/LiveListView'));

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lives',
  component: LivesIndex,
});

function LivesIndex() {
  const { region } = useAppContext();
  const navigate = useNavigate();

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <LiveListView
        onSelect={(id) => navigate({ to: '/lives/$liveId', params: { liveId: id } })}
        activeRegion={region}
      />
    </Suspense>
  );
}
