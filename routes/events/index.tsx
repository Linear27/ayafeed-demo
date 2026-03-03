
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import EventListView from '@/views/EventListView';
import { useAppContext } from '@/context/AppContext';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: EventsIndex,
});

function EventsIndex() {
  const { language, region } = useAppContext();
  const navigate = useNavigate();

  return (
    <EventListView 
      onSelect={(id) => navigate({ to: '/events/$eventId', params: { eventId: id } })} 
      userLanguage={language} 
      activeRegion={region}
    />
  );
}
