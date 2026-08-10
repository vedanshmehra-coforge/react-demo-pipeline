import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = ({
  title = 'No records found',
  description = 'Try adjusting your filters or search terms.',
  icon,
  action,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="text-gray-300 mb-4">
      {icon ?? <Inbox className="w-12 h-12" />}
    </div>
    <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
    {action}
  </div>
);
