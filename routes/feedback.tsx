import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { FeedbackPlaceholder } from '@/views/StaticPages';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feedback',
  component: FeedbackPage,
});

function FeedbackPage() {
  return <FeedbackPlaceholder />;
}
