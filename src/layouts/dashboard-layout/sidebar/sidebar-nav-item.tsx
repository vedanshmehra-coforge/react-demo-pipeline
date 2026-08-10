import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@shared/utils/cn';
import type { ReactNode } from 'react';

interface SidebarNavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  badge?: number;
  hasChildren?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export const SidebarNavItem = ({
  to, icon, label, badge, hasChildren, collapsed, onClick,
}: SidebarNavItemProps) => (
  <NavLink
    to={to}
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
        isActive
          ? 'bg-blue-600 text-white font-medium'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
      )
    }
  >
    <span className="flex-shrink-0">{icon}</span>
    {!collapsed && (
      <>
        <span className="flex-1 truncate">{label}</span>
        {badge !== undefined && (
          <span className="bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center leading-none flex-shrink-0">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
        {hasChildren && <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-60" />}
      </>
    )}
  </NavLink>
);
