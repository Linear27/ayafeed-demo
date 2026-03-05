
import { Suspense, lazy } from 'react';
import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { useAppContext } from '@/context/AppContext';
import RouteLoadingFallback from '@/components/RouteLoadingFallback';

const ExperimentalLandingView = lazy(() => import('@/views/ExperimentalLandingView'));

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/landing-exp',
  component: LandingExp,
});

function LandingExp() {
  const { theme } = useAppContext();

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <ExperimentalLandingView
        theme={theme}
      />
    </Suspense>
  );
}
