import { cn } from '@shared/utils/cn';
import { STATUS_LABEL, STATUS_VARIANT } from '../../services/toll-notification.service';
import type { TollNotificationStatus } from '../../types/toll-notification.types';

interface NotificationStatusBadgeProps {
  status: TollNotificationStatus;
  className?: string;
}

export const NotificationStatusBadge = ({ status, className }: NotificationStatusBadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
      STATUS_VARIANT[status],
      className,
    )}
  >
    {STATUS_LABEL[status]}
  </span>
);
