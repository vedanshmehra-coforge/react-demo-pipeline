import type { User } from '@shared/types/auth.types';

/** Static mock user used while backend API integration is pending. */
export const MOCK_USER: User = {
  id: 'u-mock-001',
  username: 'admin',
  email: 'admin@nhai.gov.in',
  fullName: 'Miss Annu Sham',
  role: 'ADMIN',
  department: 'Toll Operations',
  designation: 'Senior Officer',
  isActive: true,
  lastLoginAt: new Date().toISOString(),
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
};
