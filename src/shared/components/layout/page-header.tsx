import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@shared/utils/cn';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({
  title, description, breadcrumbs, actions, className,
}: PageHeaderProps) => (
  <div className={cn('mb-6', className)}>
    {breadcrumbs && breadcrumbs.length > 0 && (
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
            {crumb.href ? (
              <Link to={crumb.href} className="hover:text-blue-600 transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-800 font-medium">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
    )}
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  </div>
);
