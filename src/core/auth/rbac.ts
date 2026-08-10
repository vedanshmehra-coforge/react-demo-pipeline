export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'TOLL_OFFICER'
  | 'FIELD_ENGINEER'
  | 'AUDITOR'
  | 'VIEWER';

export type Permission =
  // Wildcard
  | '*'
  // Toll Master
  | 'toll-master:read'
  | 'toll-master:create'
  | 'toll-master:update'
  | 'toll-master:delete'
  // Toll Notification
  | 'toll-notification:read'
  | 'toll-notification:create'
  | 'toll-notification:update'
  | 'toll-notification:approve'
  | 'toll-notification:reject'
  // UFA Empanelment
  | 'ufa-empanelment:read'
  | 'ufa-empanelment:create'
  | 'ufa-empanelment:update'
  | 'ufa-empanelment:approve'
  // UFA Onboarding
  | 'ufa-onboarding:read'
  | 'ufa-onboarding:create'
  | 'ufa-onboarding:update'
  // Toll Bid Management
  | 'toll-bid:read'
  | 'toll-bid:create'
  | 'toll-bid:update'
  | 'toll-bid:approve'
  // Force Majeure
  | 'force-majeure:read'
  | 'force-majeure:create'
  | 'force-majeure:update'
  | 'force-majeure:approve'
  // Remittance
  | 'toll-remittance:read'
  | 'toll-remittance:create'
  | 'toll-remittance:approve'
  // PBG
  | 'toll-pbg:read'
  | 'toll-pbg:create'
  | 'toll-pbg:update'
  // Grievance
  | 'toll-grievance:read'
  | 'toll-grievance:create'
  | 'toll-grievance:update'
  | 'toll-grievance:resolve'
  // User Management
  | 'user-management:read'
  | 'user-management:create'
  | 'user-management:update'
  | 'user-management:delete'
  // Reports
  | 'reports:read'
  | 'reports:export'
  // Audit
  | 'audit:read';

const PERMISSION_MAP: Record<Role, Permission[]> = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    'toll-master:read', 'toll-master:create', 'toll-master:update',
    'toll-notification:read', 'toll-notification:create', 'toll-notification:update', 'toll-notification:approve', 'toll-notification:reject',
    'ufa-empanelment:read', 'ufa-empanelment:create', 'ufa-empanelment:update', 'ufa-empanelment:approve',
    'ufa-onboarding:read', 'ufa-onboarding:create', 'ufa-onboarding:update',
    'toll-bid:read', 'toll-bid:create', 'toll-bid:update', 'toll-bid:approve',
    'force-majeure:read', 'force-majeure:create', 'force-majeure:update', 'force-majeure:approve',
    'toll-remittance:read', 'toll-remittance:create', 'toll-remittance:approve',
    'toll-pbg:read', 'toll-pbg:create', 'toll-pbg:update',
    'toll-grievance:read', 'toll-grievance:create', 'toll-grievance:update', 'toll-grievance:resolve',
    'user-management:read', 'user-management:create', 'user-management:update',
    'reports:read', 'reports:export', 'audit:read',
  ],
  TOLL_OFFICER: [
    'toll-master:read',
    'toll-notification:read', 'toll-notification:create', 'toll-notification:update', 'toll-notification:approve',
    'ufa-empanelment:read', 'ufa-onboarding:read',
    'toll-bid:read', 'force-majeure:read', 'force-majeure:create',
    'toll-remittance:read', 'toll-pbg:read',
    'toll-grievance:read', 'toll-grievance:update',
    'reports:read',
  ],
  FIELD_ENGINEER: [
    'toll-master:read',
    'toll-notification:read',
    'ufa-empanelment:read', 'ufa-empanelment:create',
    'ufa-onboarding:read', 'ufa-onboarding:create', 'ufa-onboarding:update',
    'toll-bid:read',
    'reports:read',
  ],
  AUDITOR: [
    'toll-master:read', 'toll-notification:read', 'ufa-empanelment:read',
    'ufa-onboarding:read', 'toll-bid:read', 'force-majeure:read',
    'toll-remittance:read', 'toll-pbg:read', 'toll-grievance:read',
    'reports:read', 'reports:export', 'audit:read',
  ],
  VIEWER: [
    'toll-master:read', 'toll-notification:read', 'reports:read',
  ],
};

export const resolvePermissions = (role: Role): Permission[] =>
  PERMISSION_MAP[role] ?? [];

export const hasPermission = (permissions: Permission[], required: Permission): boolean =>
  permissions.includes('*') || permissions.includes(required);

export const hasAnyPermission = (permissions: Permission[], required: Permission[]): boolean =>
  required.some((p) => hasPermission(permissions, p));

export const hasAllPermissions = (permissions: Permission[], required: Permission[]): boolean =>
  required.every((p) => hasPermission(permissions, p));
