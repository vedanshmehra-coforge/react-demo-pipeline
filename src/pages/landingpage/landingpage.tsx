import { CalendarIcon } from 'lucide-react';

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  value: string;
  label: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  iconBg: string;
}

const StatCard = ({ value, label, change, positive, icon, iconBg }: StatCardProps) => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3 shadow-sm">
    <div className={`${iconBg} rounded-lg p-2 flex-shrink-0`}>{icon}</div>
    <div className="min-w-0">
      <div className="text-xl font-bold text-gray-800">{value}</div>
      <div className="text-xs text-gray-500 leading-tight">{label}</div>
      <div className="text-xs text-gray-400 mt-1">
        vs{' '}
        <span className={`font-medium ${positive ? 'text-green-500' : 'text-red-500'}`}>
          {positive ? '↑' : '↓'} {change}
        </span>{' '}
        last month
      </div>
    </div>
  </div>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const ProgressBar = ({ pct }: { pct: number }) => (
  <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
  </div>
);

// ─── Donut Chart ──────────────────────────────────────────────────────────────

const DonutChart = () => {
  const cx = 70, cy = 70, r = 48, strokeW = 20;
  const circumference = 2 * Math.PI * r;
  const segments = [
    { pct: 0.686, color: '#22c55e', label: 'Approved', value: 856,  pctLabel: '68.6%' },
    { pct: 0.221, color: '#f59e0b', label: 'Pending',  value: 276,  pctLabel: '22.1%' },
    { pct: 0.038, color: '#ef4444', label: 'Rejected', value: 48,   pctLabel: '3.8%'  },
    { pct: 0.055, color: '#94a3b8', label: 'Draft',    value: 68,   pctLabel: '5.5%'  },
  ];
  let offset = 0;
  const arcs = segments.map((seg) => {
    const dash = seg.pct * circumference;
    const gap = circumference - dash;
    const rotation = offset * 360 - 90;
    offset += seg.pct;
    return { ...seg, dash, gap, rotation };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          {arcs.map((arc, i) => (
            <circle
              key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={arc.color} strokeWidth={strokeW}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              transform={`rotate(${arc.rotation} ${cx} ${cy})`}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-gray-800">1,234</span>
          <span className="text-xs text-gray-500">Total</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        {arcs.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-sm text-gray-600 flex-1">{seg.label}</span>
            <span className="text-sm font-semibold text-gray-800">{seg.value}</span>
            <span className="text-xs text-gray-400 w-12 text-right">({seg.pctLabel})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Dashboard Page (content only — layout provided by DashboardLayout) ──────

export default function LandingPage() {
  const stats: StatCardProps[] = [
    { value: '1,248', label: 'Total Records',       change: '12.5%', positive: true,  icon: <FileIconSvg />,    iconBg: 'bg-blue-50 text-blue-500'    },
    { value: '856',   label: 'Approved Records',    change: '18.2%', positive: true,  icon: <CheckIconSvg />,   iconBg: 'bg-green-50 text-green-500'  },
    { value: '276',   label: 'Pending Actions',     change: '8.7%',  positive: false, icon: <ClockIconSvg />,   iconBg: 'bg-amber-50 text-amber-500'  },
    { value: '134',   label: 'Active Users',        change: '9.1%',  positive: true,  icon: <UsersIconSvg />,   iconBg: 'bg-purple-50 text-purple-500' },
    { value: '78',    label: 'Empanelled Agencies', change: '7.3%',  positive: true,  icon: <BuildingIconSvg />, iconBg: 'bg-teal-50 text-teal-500'   },
  ];

  const activities = [
    { iconColor: 'text-green-500 bg-green-50', title: 'Toll Notification N/2025/05/001 approved',     sub: 'Dukheri Toll Plaza',         time: '2 mins ago'  },
    { iconColor: 'text-blue-500 bg-blue-50',   title: 'New agency M/s Highway Infra Ltd. empanelled', sub: 'Empanelment',                time: '15 mins ago' },
    { iconColor: 'text-amber-500 bg-amber-50', title: 'LOA issued for Project NH-248A',               sub: 'Onboarding',                 time: '1 hour ago'  },
    { iconColor: 'text-teal-500 bg-teal-50',   title: 'Toll Plaza Master data updated',               sub: 'Ambala-Kurukshetra Section', time: '2 hours ago' },
    { iconColor: 'text-gray-500 bg-gray-100',  title: 'Monthly revenue report generated',             sub: 'Toll Operations',            time: '3 hours ago' },
  ];

  const locations = [
    { name: 'Chandigarh',  records: 325, pct: 78 },
    { name: 'Ambala',      records: 210, pct: 65 },
    { name: 'Dukheri',     records: 168, pct: 82 },
    { name: 'Manoli',      records: 142, pct: 60 },
    { name: 'Bhatt Majra', records: 110, pct: 75 },
  ];

  return (
    <div>
      {/* Page title row */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of all modules and key activities</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 shadow-sm flex-shrink-0">
          <CalendarIcon className="w-4 h-4" />
          08 May 2025
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Activities</h2>
            <a href="#" className="text-blue-600 text-sm hover:underline font-medium">View All</a>
          </div>
          <div className="divide-y divide-gray-50">
            {activities.map((act, i) => (
              <div key={i} className="flex gap-3 items-start py-3 first:pt-0 last:pb-0">
                <div className={`${act.iconColor} rounded-full p-1.5 flex-shrink-0 mt-0.5`}>
                  <div className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium leading-snug line-clamp-2">{act.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{act.sub}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Records Status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Records Status</h2>
          </div>
          <DonutChart />
          <div className="mt-4 text-right">
            <a href="#" className="text-sm text-blue-600 hover:underline font-medium">View Report →</a>
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Top Locations</h2>
            <a href="#" className="text-blue-600 text-sm hover:underline font-medium">View All</a>
          </div>
          <div className="flex text-xs text-gray-400 font-medium mb-2">
            <span className="flex-1">Location</span>
            <span className="w-12 text-right">Records</span>
            <span className="w-20 text-right">Progress</span>
          </div>
          <div className="space-y-3">
            {locations.map((loc, i) => (
              <div key={i} className="flex items-center gap-2 rounded hover:bg-gray-50 -mx-1 px-1 py-0.5">
                <span className="flex-1 text-sm text-gray-700 truncate">{loc.name}</span>
                <span className="w-10 text-right text-sm text-gray-600 font-medium">{loc.records}</span>
                <div className="w-16 flex items-center gap-1">
                  <ProgressBar pct={loc.pct} />
                  <span className="text-xs text-gray-500 w-8 text-right flex-shrink-0">{loc.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Inline SVG icon components ───────────────────────────────────────────────

const FileIconSvg = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
  </svg>
);
const CheckIconSvg = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ClockIconSvg = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const UsersIconSvg = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);
const BuildingIconSvg = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);
