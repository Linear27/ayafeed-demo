
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import ComponentShowcaseView from '@/views/ComponentShowcaseView';
import { useAppContext } from '@/context/AppContext';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/showcase',
  component: Showcase,
});

function Showcase() {
  const navigate = useNavigate();

  return (
    <ComponentShowcaseView 
      onNavigate={(v) => {
        if (v === 'LANDING') navigate({ to: '/' });
        if (v === 'EVENT_LIST_EXP') navigate({ to: '/events/exp' });
      }} 
    />
  );
}
