import type { ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

interface SectionCardProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const SectionCard = ({
  title, description, actions, children, className, noPadding,
}: SectionCardProps) => (
  <div className={cn('bg-white rounded-xl border border-gray-100 shadow-sm', className)}>
    {(title || actions) && (
      <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
        <div>
          {title && <h2 className="text-base font-semibold text-gray-800">{title}</h2>}
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 ml-4">{actions}</div>}
      </div>
    )}
    <div className={cn(!noPadding && 'p-5')}>{children}</div>
  </div>
);
