import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore, useAuthHydrated } from '@store/auth.store';
import { ROUTES } from '@shared/constants/routes';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrated        = useAuthHydrated();
  const location        = useLocation();

  // Don't render anything until Zustand has finished reading sessionStorage.
  // This prevents the login-page flash on reload.
  if (!hydrated) return null;

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.AUTH.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};
