import type { TollGrievance } from '../types/toll-grievance.types';
import type { User } from '@shared/types/auth.types';

export const tollGrievanceService = {
  canResolve: (record: TollGrievance, user: User): boolean =>
    record.status === 'PENDING' && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'TOLL_OFFICER'),

  canEdit: (record: TollGrievance): boolean =>
    record.status === 'DRAFT' || record.status === 'REJECTED',

  canDelete: (record: TollGrievance): boolean =>
    record.status === 'DRAFT',

  getNextStatus: (
    current: TollGrievance['status'],
    action: 'submit' | 'approve' | 'reject' | 'close',
  ): TollGrievance['status'] => {
    const transitions: Partial<Record<TollGrievance['status'], Partial<Record<typeof action, TollGrievance['status']>>>> = {
      DRAFT:    { submit: 'PENDING' },
      PENDING:  { approve: 'APPROVED', reject: 'REJECTED' },
      APPROVED: { close: 'CLOSED' },
      REJECTED: { submit: 'PENDING' },
    };
    return transitions[current]?.[action] ?? current;
  },
};
