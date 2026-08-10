import { X } from 'lucide-react';
import {
  LayoutDashboard, FileText, Users, Building2, BarChart3,
  Shield, Settings, Bell, TrendingUp, Gavel, AlertTriangle,
  CreditCard, FileCheck, MessageSquare,
} from 'lucide-react';
import { SidebarNavItem } from './sidebar-nav-item';
import { ROUTES } from '@shared/constants/routes';
import { cn } from '@shared/utils/cn';
import { APP_NAME, ORGANIZATION } from '@shared/constants/app.constants';

interface SidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ collapsed, onClose }: SidebarProps) => (
  <aside
    className={cn(
      'bg-[#1a2238] flex flex-col h-full overflow-y-auto transition-all duration-200',
      collapsed ? 'w-16' : 'w-56',
    )}
  >
    {/* Logo */}
    <div className={cn(
      'flex items-center border-b border-gray-700 flex-shrink-0',
      collapsed ? 'justify-center p-3' : 'px-4 py-4 gap-3',
    )}>
      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-[9px] font-bold leading-none">NHAI</span>
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <div className="text-white text-[10px] font-semibold leading-tight truncate">{ORGANIZATION}</div>
          <div className="text-cyan-400 text-[10px] font-bold mt-0.5">{APP_NAME}</div>
        </div>
      )}
      {onClose && (
        <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white ml-auto">
          <X className="w-5 h-5" />
        </button>
      )}
    </div>

    {/* Nav */}
    <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
      <SidebarNavItem to={ROUTES.DASHBOARD} icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" collapsed={collapsed} onClick={onClose} />

      {!collapsed && <p className="pt-4 pb-1 px-2 text-gray-500 text-[10px] font-semibold uppercase tracking-wider">Operations</p>}
      {collapsed && <div className="h-px bg-gray-700 my-2" />}

      <SidebarNavItem to={ROUTES.TOLL_MASTER.ROOT}       icon={<Building2 className="w-5 h-5" />}     label="Toll Master"          collapsed={collapsed} onClick={onClose} />
      <SidebarNavItem to={ROUTES.TOLL_NOTIFICATION.ROOT} icon={<Bell className="w-5 h-5" />}           label="Toll Notification"    collapsed={collapsed} onClick={onClose} />
      <SidebarNavItem to={ROUTES.UFA_EMPANELMENT.ROOT}   icon={<Users className="w-5 h-5" />}          label="UFA Empanelment"      collapsed={collapsed} onClick={onClose} />
      <SidebarNavItem to={ROUTES.UFA_ONBOARDING.ROOT}    icon={<FileCheck className="w-5 h-5" />}      label="UFA Onboarding"       collapsed={collapsed} onClick={onClose} />
      <SidebarNavItem to={ROUTES.TOLL_BID.ROOT}          icon={<Gavel className="w-5 h-5" />}          label="Toll Bid Management"  collapsed={collapsed} onClick={onClose} />
      <SidebarNavItem to={ROUTES.FORCE_MAJEURE.ROOT}     icon={<AlertTriangle className="w-5 h-5" />}  label="Force Majeure Claim"  collapsed={collapsed} onClick={onClose} />
      <SidebarNavItem to={ROUTES.TOLL_REMITTANCE.ROOT}   icon={<CreditCard className="w-5 h-5" />}     label="Toll Remittance"      collapsed={collapsed} onClick={onClose} />
      <SidebarNavItem to={ROUTES.TOLL_PBG.ROOT}          icon={<FileText className="w-5 h-5" />}       label="Toll PBG"             collapsed={collapsed} onClick={onClose} />
      <SidebarNavItem to={ROUTES.TOLL_GRIEVANCE.ROOT}    icon={<MessageSquare className="w-5 h-5" />}  label="Toll Grievance"       collapsed={collapsed} onClick={onClose} />

      {!collapsed && <p className="pt-4 pb-1 px-2 text-gray-500 text-[10px] font-semibold uppercase tracking-wider">Reports</p>}
      {collapsed && <div className="h-px bg-gray-700 my-2" />}

      <SidebarNavItem to="/reports"   icon={<BarChart3 className="w-5 h-5" />}  label="Reports & Analytics" collapsed={collapsed} onClick={onClose} />
      <SidebarNavItem to="/audit"     icon={<Shield className="w-5 h-5" />}     label="Audit Trail"         collapsed={collapsed} onClick={onClose} />
      <SidebarNavItem to="/users"     icon={<TrendingUp className="w-5 h-5" />} label="User Management"     collapsed={collapsed} onClick={onClose} />

      {!collapsed && <p className="pt-4 pb-1 px-2 text-gray-500 text-[10px] font-semibold uppercase tracking-wider">System</p>}
      {collapsed && <div className="h-px bg-gray-700 my-2" />}

      <SidebarNavItem to="/settings" icon={<Settings className="w-5 h-5" />} label="System Settings" collapsed={collapsed} onClick={onClose} />
    </nav>
  </aside>
);
