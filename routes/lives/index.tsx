
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import LiveListView from '@/views/LiveListView';
import { useAppContext } from '@/context/AppContext';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lives',
  component: LivesIndex,
});

function LivesIndex() {
  const { region } = useAppContext();
  const navigate = useNavigate();

  return (
    <LiveListView 
      onSelect={(id) => navigate({ to: '/lives/$liveId', params: { liveId: id } })} 
      activeRegion={region}
    />
  );
}
