import type { TollBid } from '../types/toll-bid-management.types';
import type { User } from '@shared/types/auth.types';

/**
 * Pure business logic for Toll Bid Management.
 * No HTTP calls, no React hooks — fully testable.
 */
export const tollBidService = {
  canApprove: (record: TollBid, user: User): boolean =>
    record.status === 'PENDING' && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'),

  canEdit: (record: TollBid): boolean =>
    record.status === 'DRAFT' || record.status === 'REJECTED',

  canDelete: (record: TollBid): boolean =>
    record.status === 'DRAFT',

  getNextStatus: (
    current: TollBid['status'],
    action: 'submit' | 'approve' | 'reject' | 'close',
  ): TollBid['status'] => {
    const transitions: Partial<Record<TollBid['status'], Partial<Record<typeof action, TollBid['status']>>>> = {
      DRAFT:    { submit: 'PENDING' },
      PENDING:  { approve: 'APPROVED', reject: 'REJECTED' },
      APPROVED: { close: 'CLOSED' },
      REJECTED: { submit: 'PENDING' },
    };
    return transitions[current]?.[action] ?? current;
  },
};
