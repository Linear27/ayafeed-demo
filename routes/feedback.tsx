import { Suspense, lazy } from 'react';
import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import RouteLoadingFallback from '@/components/RouteLoadingFallback';

const FeedbackPlaceholder = lazy(() =>
  import('@/views/StaticPages').then((module) => ({ default: module.FeedbackPlaceholder })),
);

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feedback',
  component: FeedbackPage,
});

function FeedbackPage() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <FeedbackPlaceholder />
    </Suspense>
  );
}
