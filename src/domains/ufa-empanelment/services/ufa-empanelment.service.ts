import type { UfaEmpanelment } from '../types/ufa-empanelment.types';
import type { User } from '@shared/types/auth.types';

export const ufaEmpanelmentService = {
  canApprove: (record: UfaEmpanelment, user: User): boolean =>
    record.status === 'PENDING' && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'),

  canEdit: (record: UfaEmpanelment): boolean =>
    record.status === 'DRAFT' || record.status === 'REJECTED',

  canDelete: (record: UfaEmpanelment): boolean =>
    record.status === 'DRAFT',

  getNextStatus: (
    current: UfaEmpanelment['status'],
    action: 'submit' | 'approve' | 'reject' | 'close',
  ): UfaEmpanelment['status'] => {
    const transitions: Partial<Record<UfaEmpanelment['status'], Partial<Record<typeof action, UfaEmpanelment['status']>>>> = {
      DRAFT:    { submit: 'PENDING' },
      PENDING:  { approve: 'APPROVED', reject: 'REJECTED' },
      APPROVED: { close: 'CLOSED' },
      REJECTED: { submit: 'PENDING' },
    };
    return transitions[current]?.[action] ?? current;
  },
};
