import type { TollMaster } from '../types/toll-master.types';
import type { User } from '@shared/types/auth.types';

/**
 * Pure business logic for Toll Master.
 * No HTTP calls, no React hooks — fully testable.
 */
export const tollMasterService = {
  canApprove: (record: TollMaster, user: User): boolean =>
    record.status === 'PENDING' && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'),

  canEdit: (record: TollMaster): boolean =>
    record.status === 'DRAFT' || record.status === 'REJECTED',

  canDelete: (record: TollMaster): boolean =>
    record.status === 'DRAFT',

  getNextStatus: (
    current: TollMaster['status'],
    action: 'submit' | 'approve' | 'reject' | 'close',
  ): TollMaster['status'] => {
    const transitions: Partial<Record<TollMaster['status'], Partial<Record<typeof action, TollMaster['status']>>>> = {
      DRAFT:    { submit: 'PENDING' },
      PENDING:  { approve: 'APPROVED', reject: 'REJECTED' },
      APPROVED: { close: 'CLOSED' },
      REJECTED: { submit: 'PENDING' },
    };
    return transitions[current]?.[action] ?? current;
  },
};
