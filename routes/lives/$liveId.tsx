
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import LiveDetailView from '@/views/LiveDetailView';
import { useAppContext } from '@/context/AppContext';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lives/$liveId',
  component: LiveDetail,
});

function LiveDetail() {
  const { liveId } = Route.useParams();
  const { theme } = useAppContext();
  const navigate = useNavigate();

  return (
    <LiveDetailView 
      id={liveId} 
      onBack={() => navigate({ to: '/lives' })} 
      theme={theme}
    />
  );
}
