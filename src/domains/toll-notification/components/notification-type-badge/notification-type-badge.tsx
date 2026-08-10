import { cn } from '@shared/utils/cn';
import { NOTIFICATION_TYPE_LABELS } from '../../validation/toll-notification.schema';

const TYPE_STYLES: Record<string, string> = {
  RATE_CHANGE:  'bg-blue-100 text-blue-700',
  CLOSURE:      'bg-red-100 text-red-700',
  MAINTENANCE:  'bg-amber-100 text-amber-700',
  GENERAL:      'bg-gray-100 text-gray-700',
  EMERGENCY:    'bg-red-600 text-white',
};

interface NotificationTypeBadgeProps {
  type: string;
  className?: string;
}

export const NotificationTypeBadge = ({ type, className }: NotificationTypeBadgeProps) => (
  <span className={cn(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
    TYPE_STYLES[type] ?? 'bg-gray-100 text-gray-700',
    className,
  )}>
    {NOTIFICATION_TYPE_LABELS[type] ?? type}
  </span>
);
