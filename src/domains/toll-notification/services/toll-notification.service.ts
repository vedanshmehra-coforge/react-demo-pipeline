import type { TollNotification, TollNotificationStatus } from '../types/toll-notification.types';
import type { User } from '@shared/types/auth.types';

export const STATUS_LABEL: Record<TollNotificationStatus, string> = {
  DRAFT:       'Draft',
  SUBMITTED:   'Submitted By PIU',
  CO_REVIEWED: 'E-Office Updated By CO',
  SO_ISSUED:   'S.O. Number Updated',
  PUBLISHED:   'Published',
  REJECTED:    'Rejected',
};

export const STATUS_VARIANT: Record<TollNotificationStatus, string> = {
  DRAFT:       'bg-gray-100 text-gray-600',
  SUBMITTED:   'bg-amber-100 text-amber-700',
  CO_REVIEWED: 'bg-blue-100 text-blue-700',
  SO_ISSUED:   'bg-purple-100 text-purple-700',
  PUBLISHED:   'bg-green-100 text-green-700',
  REJECTED:    'bg-red-100 text-red-700',
};

/**
 * Pure business logic for Toll Notification SOP workflow.
 * No HTTP calls, no React — fully unit-testable.
 *
 *  PIU:  DRAFT → submit → SUBMITTED
 *  CO:   SUBMITTED → updateEOffice → CO_REVIEWED
 *  CO:   CO_REVIEWED → updateSoNumber → SO_ISSUED
 *  CO:   SO_ISSUED → publish → PUBLISHED
 *  CO:   SUBMITTED|CO_REVIEWED → reject → REJECTED
 *  PIU:  REJECTED → edit+submit → SUBMITTED
 */
export const tollNotificationService = {
  // ── PIU ──────────────────────────────────────────────────────────────────
  canPiuEdit:   (n: TollNotification) => n.status === 'DRAFT'      || n.status === 'REJECTED',
  canPiuSubmit: (n: TollNotification) => n.status === 'DRAFT'      || n.status === 'REJECTED',
  canPiuDelete: (n: TollNotification) => n.status === 'DRAFT',

  // ── CO-Division ───────────────────────────────────────────────────────────
  canCoUpdateEOffice:  (n: TollNotification) => n.status === 'SUBMITTED',
  canCoUpdateSoNumber: (n: TollNotification) => n.status === 'CO_REVIEWED',
  canCoPublish:        (n: TollNotification) => n.status === 'SO_ISSUED',
  canCoReject:         (n: TollNotification) => n.status === 'SUBMITTED' || n.status === 'CO_REVIEWED',

  // ── Role checks ───────────────────────────────────────────────────────────
  isPiu: (user: User) => user.role === 'FIELD_ENGINEER' || user.role === 'VIEWER',
  isCo:  (user: User) => user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'TOLL_OFFICER',

  // ── Workflow step (for stepper UI) ────────────────────────────────────────
  getWorkflowStep: (status: TollNotificationStatus): number => {
    const steps: Record<TollNotificationStatus, number> = {
      DRAFT: 1, SUBMITTED: 2, CO_REVIEWED: 3, SO_ISSUED: 4, PUBLISHED: 5, REJECTED: 0,
    };
    return steps[status] ?? 0;
  },

  // ── Next action hint ──────────────────────────────────────────────────────
  getNextActionLabel: (n: TollNotification, user: User): string => {
    if (tollNotificationService.isPiu(user)) {
      if (n.status === 'DRAFT')     return 'Submit to CO-Division';
      if (n.status === 'REJECTED')  return 'Edit & Resubmit';
    }
    if (tollNotificationService.isCo(user)) {
      if (n.status === 'SUBMITTED')   return 'Update E-Office File Number';
      if (n.status === 'CO_REVIEWED') return 'Update Notification S.O. Number';
      if (n.status === 'SO_ISSUED')   return 'Publish Notification';
    }
    return '';
  },
};
