
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import ExperimentalLandingView from '@/views/ExperimentalLandingView';
import { useAppContext } from '@/context/AppContext';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/landing-exp',
  component: LandingExp,
});

function LandingExp() {
  const { theme } = useAppContext();
  const navigate = useNavigate();

  return (
    <ExperimentalLandingView 
      theme={theme} 
    />
  );
}
