
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import CircleListView from '@/views/CircleListView';
import { useAppContext } from '@/context/AppContext';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/circles',
  component: CirclesIndex,
});

function CirclesIndex() {
  const navigate = useNavigate();

  return (
    <CircleListView 
      onSelect={(id) => navigate({ to: '/circles/$circleId', params: { circleId: id } })} 
    />
  );
}
