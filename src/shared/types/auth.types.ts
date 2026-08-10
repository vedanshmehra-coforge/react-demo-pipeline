import type { Role, Permission } from '@core/auth/rbac';
import type { ID, Timestamps } from './common.types';

export type { Role, Permission };

export type User = {
  id: ID;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  department: string;
  designation: string;
  isActive: boolean;
  lastLoginAt: string | null;
} & Timestamps;

export type AuthState = {
  user: User | null;
  permissions: Permission[];
  isAuthenticated: boolean;
};
