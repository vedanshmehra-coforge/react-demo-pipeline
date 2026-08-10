import type { UfaOnboarding } from '../types/ufa-onboarding.types';
import type { User } from '@shared/types/auth.types';

export const ufaOnboardingService = {
  canApprove: (record: UfaOnboarding, user: User): boolean =>
    record.status === 'PENDING' && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'),

  canEdit: (record: UfaOnboarding): boolean =>
    record.status === 'DRAFT' || record.status === 'REJECTED',

  canDelete: (record: UfaOnboarding): boolean =>
    record.status === 'DRAFT',

  getNextStatus: (
    current: UfaOnboarding['status'],
    action: 'submit' | 'approve' | 'reject' | 'close',
  ): UfaOnboarding['status'] => {
    const transitions: Partial<Record<UfaOnboarding['status'], Partial<Record<typeof action, UfaOnboarding['status']>>>> = {
      DRAFT:    { submit: 'PENDING' },
      PENDING:  { approve: 'APPROVED', reject: 'REJECTED' },
      APPROVED: { close: 'CLOSED' },
      REJECTED: { submit: 'PENDING' },
    };
    return transitions[current]?.[action] ?? current;
  },
};
