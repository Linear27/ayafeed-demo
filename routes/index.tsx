
import { Suspense, lazy } from 'react';
import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { useAppContext } from '@/context/AppContext';
import RouteLoadingFallback from '@/components/RouteLoadingFallback';

const LandingView = lazy(() => import('@/views/LandingView'));

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});

function Index() {
  const { region } = useAppContext();

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <LandingView
        region={region}
      />
    </Suspense>
  );
}
