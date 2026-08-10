import { Navigate, Outlet } from 'react-router-dom';
import { usePermissions } from '@shared/hooks/use-permissions';
import { ROUTES } from '@shared/constants/routes';
import type { Permission } from '@shared/types/auth.types';

interface RoleRouteProps {
  permission: Permission;
}

export const RoleRoute = ({ permission }: RoleRouteProps) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return <Outlet />;
};
