
import { Suspense, lazy } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import { useAppContext } from '@/context/AppContext';
import RouteLoadingFallback from '@/components/RouteLoadingFallback';

const CircleDetailView = lazy(() => import('@/views/CircleDetailView'));

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/circles/$circleId',
  component: CircleDetail,
});

function CircleDetail() {
  const { circleId } = Route.useParams();
  const { theme } = useAppContext();
  const navigate = useNavigate();

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <CircleDetailView
        id={circleId}
        onBack={() => navigate({ to: '/circles' })}
        theme={theme}
      />
    </Suspense>
  );
}
