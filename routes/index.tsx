
import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import LandingView from '@/views/LandingView';
import { useAppContext } from '@/context/AppContext';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});

function Index() {
  const { region } = useAppContext();

  return (
    <LandingView 
      region={region}
    />
  );
}
