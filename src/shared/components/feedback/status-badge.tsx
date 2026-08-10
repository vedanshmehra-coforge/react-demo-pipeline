import { Badge } from '@shared/components/ui/badge';
import { STATUS_LABELS } from '@shared/constants/app.constants';
import type { BadgeVariant } from '../ui/badge';

// Map status string → Badge variant
const STATUS_VARIANT_MAP: Record<string, BadgeVariant> = {
  DRAFT:      'outline',
  PENDING:    'warning',
  APPROVED:   'success',
  REJECTED:   'danger',
  CLOSED:     'info',
  ACTIVE:     'success',
  INACTIVE:   'default',
  CANCELLED:  'danger',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => (
  <Badge
    variant={STATUS_VARIANT_MAP[status] ?? 'default'}
    className={className}
  >
    {STATUS_LABELS[status] ?? status}
  </Badge>
);
