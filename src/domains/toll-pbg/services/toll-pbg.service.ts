import type { TollPbg } from '../types/toll-pbg.types';
import type { User } from '@shared/types/auth.types';

/**
 * Pure business logic for Toll PBG.
 * No HTTP calls, no React hooks — fully testable.
 */
export const tollPbgService = {
  canApprove: (record: TollPbg, user: User): boolean =>
    record.status === 'PENDING' && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'),

  canEdit: (record: TollPbg): boolean =>
    record.status === 'DRAFT' || record.status === 'REJECTED',

  canDelete: (record: TollPbg): boolean =>
    record.status === 'DRAFT',

  getNextStatus: (
    current: TollPbg['status'],
    action: 'submit' | 'approve' | 'reject' | 'close',
  ): TollPbg['status'] => {
    const transitions: Partial<Record<TollPbg['status'], Partial<Record<typeof action, TollPbg['status']>>>> = {
      DRAFT:    { submit: 'PENDING' },
      PENDING:  { approve: 'APPROVED', reject: 'REJECTED' },
      APPROVED: { close: 'CLOSED' },
      REJECTED: { submit: 'PENDING' },
    };
    return transitions[current]?.[action] ?? current;
  },
};
