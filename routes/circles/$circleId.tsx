
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import CircleDetailView from '@/views/CircleDetailView';
import { useAppContext } from '@/context/AppContext';

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
    <CircleDetailView 
      id={circleId} 
      onBack={() => navigate({ to: '/circles' })} 
      theme={theme} 
    />
  );
}
