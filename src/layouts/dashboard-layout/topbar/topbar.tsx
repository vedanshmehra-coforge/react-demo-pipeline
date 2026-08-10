import { Menu, Search, Settings, Bell, LogOut, ChevronDown, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/auth.store';
import { queryClient } from '@shared/lib/query-client';
import { ROUTES } from '@shared/constants/routes';
import { tokenService } from '@core/auth/token.service';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar = ({ onMenuClick }: TopbarProps) => {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    tokenService.clear();
    clearAuth();
    queryClient.clear();
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  };

  return (
    <header className="bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-3 sticky top-0 z-30 flex-shrink-0">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Welcome */}
      <div className="hidden sm:flex items-center gap-1 text-sm text-gray-600 flex-shrink-0">
        Welcome,
        <span className="font-semibold text-gray-900">{user?.fullName ?? 'User'}</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs relative mx-2">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="search"
          placeholder="Search anything…"
          className="w-full pl-8 pr-3 h-8 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 ml-auto">
        <button
          className="hidden sm:flex text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        <button
          className="relative text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        <Link
          to="#"
          className="hidden md:flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700 px-2"
        >
          <HelpCircle className="w-4 h-4" />
          Help Desk
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg px-3 h-8 hover:bg-gray-50 ml-1"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
