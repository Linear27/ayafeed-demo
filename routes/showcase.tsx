
import { Suspense, lazy } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import RouteLoadingFallback from '@/components/RouteLoadingFallback';

const ComponentShowcaseView = lazy(() => import('@/views/ComponentShowcaseView'));

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/showcase',
  component: Showcase,
});

function Showcase() {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <ComponentShowcaseView
        onNavigate={(v) => {
          if (v === 'LANDING') navigate({ to: '/' });
          if (v === 'EVENT_LIST_EXP') navigate({ to: '/events/exp' });
          if (v === 'LANDING_EXP') navigate({ to: '/landing-exp' });
        }}
      />
    </Suspense>
  );
}
