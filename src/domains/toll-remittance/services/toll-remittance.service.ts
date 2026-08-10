import type { TollRemittance } from '../types/toll-remittance.types';
import type { User } from '@shared/types/auth.types';

/**
 * Pure business logic for Toll Remittance.
 * No HTTP calls, no React hooks — fully testable.
 */
export const tollRemittanceService = {
  canApprove: (record: TollRemittance, user: User): boolean =>
    record.status === 'PENDING' && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'),

  canEdit: (record: TollRemittance): boolean =>
    record.status === 'DRAFT' || record.status === 'REJECTED',

  canDelete: (record: TollRemittance): boolean =>
    record.status === 'DRAFT',

  getNextStatus: (
    current: TollRemittance['status'],
    action: 'submit' | 'approve' | 'reject' | 'close',
  ): TollRemittance['status'] => {
    const transitions: Partial<Record<TollRemittance['status'], Partial<Record<typeof action, TollRemittance['status']>>>> = {
      DRAFT:    { submit: 'PENDING' },
      PENDING:  { approve: 'APPROVED', reject: 'REJECTED' },
      APPROVED: { close: 'CLOSED' },
      REJECTED: { submit: 'PENDING' },
    };
    return transitions[current]?.[action] ?? current;
  },
};
