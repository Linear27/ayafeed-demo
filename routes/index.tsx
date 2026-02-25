
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import LandingView from '@/views/LandingView';
import { useAppContext } from '@/context/AppContext';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});

function Index() {
  const { region, setRegion } = useAppContext();
  const navigate = useNavigate();

  return (
    <LandingView 
      region={region}
      onSetRegion={setRegion}
    />
  );
}
