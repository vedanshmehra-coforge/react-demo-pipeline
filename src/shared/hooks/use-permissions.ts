import { useAuthStore } from '@store/auth.store';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from '@core/auth/rbac';
import type { Permission } from '@shared/types/auth.types';

export const usePermissions = () => {
  const permissions = useAuthStore((s) => s.permissions);

  return {
    permissions,
    hasPermission: (p: Permission) => hasPermission(permissions, p),
    hasAnyPermission: (ps: Permission[]) => hasAnyPermission(permissions, ps),
    hasAllPermissions: (ps: Permission[]) => hasAllPermissions(permissions, ps),
    isSuperAdmin: permissions.includes('*'),
  };
};
