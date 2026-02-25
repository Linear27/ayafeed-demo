
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root';
import EventListExperienceView from '@/views/EventListExperienceView';
import { useAppContext } from '@/context/AppContext';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/exp',
  component: EventExp,
});

function EventExp() {
  const { theme } = useAppContext();
  const navigate = useNavigate();

  return (
    <EventListExperienceView 
      onSelect={(id) => navigate({ to: '/events/$eventId', params: { eventId: id } })}
      theme={theme}
      onNavigate={(v) => {
        if (v === 'EVENT_LIST') navigate({ to: '/events' });
      }}
    />
  );
}
