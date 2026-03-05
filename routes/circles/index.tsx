
import { Suspense, lazy } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import RouteLoadingFallback from '@/components/RouteLoadingFallback';

const CircleListView = lazy(() => import('@/views/CircleListView'));

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/circles',
  component: CirclesIndex,
});

function CirclesIndex() {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <CircleListView
        onSelect={(id) => navigate({ to: '/circles/$circleId', params: { circleId: id } })}
      />
    </Suspense>
  );
}
