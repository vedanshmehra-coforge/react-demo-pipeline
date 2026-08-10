import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar/sidebar';
import { Topbar } from './topbar/topbar';
import { useUiStore } from '@store/ui.store';
import { useIsMobile } from '@shared/hooks/use-media-query';
import { ErrorBoundary } from '@shared/components/feedback/error-boundary';

export const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 flex flex-col w-56 shadow-xl">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setMobileOpen(!isMobile ? !mobileOpen : true)} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};
