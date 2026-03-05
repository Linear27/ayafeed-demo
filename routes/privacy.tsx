import { Suspense, lazy } from 'react';
import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import RouteLoadingFallback from '@/components/RouteLoadingFallback';

const PrivacyPlaceholder = lazy(() =>
  import('@/views/StaticPages').then((module) => ({ default: module.PrivacyPlaceholder })),
);

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <PrivacyPlaceholder />
    </Suspense>
  );
}
