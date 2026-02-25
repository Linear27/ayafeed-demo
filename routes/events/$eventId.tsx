
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import EventDetailView from '@/views/EventDetailView';
import { useAppContext } from '@/context/AppContext';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/$eventId',
  component: EventDetail,
});

function EventDetail() {
  const { eventId } = Route.useParams();
  const { theme } = useAppContext();
  const navigate = useNavigate();

  return (
    <EventDetailView 
      id={eventId} 
      onBack={() => navigate({ to: '/events' })} 
      onSelectCircle={(id) => navigate({ to: '/circles/$circleId', params: { circleId: id } })}
      theme={theme}
    />
  );
}
