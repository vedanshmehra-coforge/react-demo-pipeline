import type { ForceMajeure } from '../types/force-majeure-claim.types';
import type { User } from '@shared/types/auth.types';

/**
 * Pure business logic for Force Majeure Claim.
 * No HTTP calls, no React hooks — fully testable.
 */
export const forceMajeureService = {
  canApprove: (record: ForceMajeure, user: User): boolean =>
    record.status === 'PENDING' && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'),

  canEdit: (record: ForceMajeure): boolean =>
    record.status === 'DRAFT' || record.status === 'REJECTED',

  canDelete: (record: ForceMajeure): boolean =>
    record.status === 'DRAFT',

  getNextStatus: (
    current: ForceMajeure['status'],
    action: 'submit' | 'approve' | 'reject' | 'close',
  ): ForceMajeure['status'] => {
    const transitions: Partial<Record<ForceMajeure['status'], Partial<Record<typeof action, ForceMajeure['status']>>>> = {
      DRAFT:    { submit: 'PENDING' },
      PENDING:  { approve: 'APPROVED', reject: 'REJECTED' },
      APPROVED: { close: 'CLOSED' },
      REJECTED: { submit: 'PENDING' },
    };
    return transitions[current]?.[action] ?? current;
  },
};
