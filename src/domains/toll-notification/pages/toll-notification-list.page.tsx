import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, FileText, Eye } from 'lucide-react';
import { PageHeader }   from '@shared/components/layout/page-header';
import { SectionCard }  from '@shared/components/layout/section-card';
import { Button }       from '@shared/components/ui/button';
import { Input }        from '@shared/components/ui/input';
import { Select }       from '@shared/components/ui/select';
import { useDebounce }  from '@shared/hooks/use-debounce';
import { ROUTES }       from '@shared/constants/routes';
import { useTollNotificationList }         from '../hooks/use-toll-notification-list';
import { useTollNotificationFiltersStore } from '../store/toll-notification-filters.store';
import { NotificationStatusBadge }         from '../components/notification-status-badge/notification-status-badge';
import type { TollNotification } from '../types/toll-notification.types';

const STATUS_OPTIONS = [
  { value: '',            label: 'All Statuses' },
  { value: 'DRAFT',       label: 'Draft' },
  { value: 'SUBMITTED',   label: 'Submitted By PIU' },
  { value: 'CO_REVIEWED', label: 'E-Office Updated By CO' },
  { value: 'SO_ISSUED',   label: 'S.O. Number Updated' },
  { value: 'PUBLISHED',   label: 'Published' },
  { value: 'REJECTED',    label: 'Rejected' },
];

export const TollNotificationListPage = () => {
  const navigate = useNavigate();
  const { filters, setFilters, resetFilters } = useTollNotificationFiltersStore();
  const [search, setSearch] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(search, 350);

  const { data, isLoading } = useTollNotificationList({ ...filters, search: debouncedSearch });
  const records = data?.data ?? [];

  // Running serial number across pages
  const pageOffset = ((filters.page ?? 1) - 1) * (filters.pageSize ?? 10);

  return (
    <div>
      <PageHeader
        title="Toll Notifications"
        description="Toll plaza user fee notification management"
        breadcrumbs={[{ label: 'Home', href: ROUTES.DASHBOARD }, { label: 'Toll Notifications' }]}
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate(ROUTES.TOLL_NOTIFICATION.CREATE)}>
            New Notification
          </Button>
        }
      />

      <SectionCard
        title="Notification List"
        description={`${data?.pagination.total ?? 0} records`}
        actions={
          <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-blue-600 underline">
            Reset Filters
          </button>
        }
      >
        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setFilters({ search: e.target.value }); }}
              placeholder="Search UPC, project, plaza, PIU..."
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select
              options={STATUS_OPTIONS}
              value={filters.status ?? ''}
              onChange={(e) => setFilters({ status: (e.target.value as TollNotification['status']) || undefined })}
              className="w-52"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#1a2238] text-white">
                <Th>S.No.</Th>
                <Th>Action</Th>
                <Th>View</Th>
                <Th>Status</Th>
                <Th>Toll Mode</Th>
                <Th>UPC</Th>
                <Th>Project Name</Th>
                <Th>Physical Progress (%)</Th>
                <Th>PIU</Th>
                <Th>RO</Th>
                <Th>Name of Toll Plaza</Th>
                <Th>Location of Toll Plaza</Th>
                <Th>No. of Toll Lane</Th>
                <Th>Temp Toll Plaza ID</Th>
                <Th>Permanent Toll Plaza ID</Th>
                <Th>Notification S.O. Number</Th>
                <Th>Published Toll Notification</Th>
                <Th>Toll Plaza Traffic (PCU) CFY</Th>
                <Th>Traffic Survey Date</Th>
                <Th>Toll Plaza APC</Th>
                <Th>Remarks (If Rejected)</Th>
                <Th>PIU E-File No.</Th>
                <Th>PIU File Status</Th>
                <Th>CO E-File No.</Th>
                <Th>CO File Status</Th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-50">
              {isLoading && (
                <tr><td colSpan={25} className="py-12 text-center text-gray-400">Loading...</td></tr>
              )}
              {!isLoading && records.length === 0 && (
                <tr><td colSpan={25} className="py-12 text-center text-gray-400">No records found.</td></tr>
              )}

              {records.map((rec, ri) => {
                const plazaCount = rec.tollPlazas.length;
                return rec.tollPlazas.map((plaza, pi) => (
                  <tr
                    key={`${rec.id}-${plaza.id}`}
                    className="hover:bg-blue-50/30 cursor-pointer"
                    onClick={() => navigate(ROUTES.TOLL_NOTIFICATION.DETAIL(rec.id))}
                  >
                    {/* Only show project-level cells on the first plaza row */}
                    {pi === 0 ? (
                      <>
                        <Td rowSpan={plazaCount} className="font-semibold text-gray-600 bg-gray-50">
                          {pageOffset + ri + 1}
                        </Td>
                        <Td rowSpan={plazaCount} className="bg-gray-50">
                          <ActionButtons rec={rec} navigate={navigate} />
                        </Td>
                        <Td rowSpan={plazaCount} className="bg-gray-50">
                          {rec.documentName ? (
                            <a
                              href="#"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-blue-600 hover:underline"
                              title={rec.documentName}
                            >
                              <FileText className="w-3 h-3" />
                              View &amp; Download
                            </a>
                          ) : <span className="text-gray-300">—</span>}
                        </Td>
                        <Td rowSpan={plazaCount} className="bg-gray-50">
                          <NotificationStatusBadge status={rec.status} />
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{rec.statusLabel}</p>
                        </Td>
                        <Td rowSpan={plazaCount} className="bg-gray-50 whitespace-nowrap">{rec.tollMode}</Td>
                        <Td rowSpan={plazaCount} className="bg-gray-50 font-mono text-blue-700 whitespace-nowrap">{rec.upc}</Td>
                        <Td rowSpan={plazaCount} className="bg-gray-50 max-w-[200px]">
                          <p className="line-clamp-2 leading-tight" title={rec.projectName}>{rec.projectName}</p>
                        </Td>
                        <Td rowSpan={plazaCount} className="bg-gray-50 text-center">
                          {rec.physicalProgress ? `${rec.physicalProgress}%` : '—'}
                        </Td>
                        <Td rowSpan={plazaCount} className="bg-gray-50 whitespace-nowrap">{rec.piuName}</Td>
                        <Td rowSpan={plazaCount} className="bg-gray-50 whitespace-nowrap">{rec.roName}</Td>
                      </>
                    ) : null}

                    {/* Plaza-level cells — one row per plaza */}
                    <Td className="font-medium text-gray-800">{plaza.nameOfTollPlaza || '—'}</Td>
                    <Td className="max-w-[160px]">
                      <p className="line-clamp-2 leading-tight" title={plaza.locationOfTollPlaza}>
                        {plaza.locationOfTollPlaza || '—'}
                      </p>
                    </Td>
                    <Td className="text-center whitespace-nowrap">{plaza.noOfTollLane || '—'}</Td>
                    <Td className="font-mono text-[10px] whitespace-nowrap">{plaza.tempTollPlazaId || '—'}</Td>
                    <Td className="font-mono text-[10px]">{plaza.permanentTollPlazaId || '—'}</Td>

                    {pi === 0 ? (
                      <>
                        <Td rowSpan={plazaCount} className="font-mono text-purple-700 whitespace-nowrap">
                          {rec.notificationSoNumber || '—'}
                        </Td>
                        <Td rowSpan={plazaCount}>
                          {rec.publishedTollNotification ? (
                            <a href="#" onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-blue-600 hover:underline whitespace-nowrap">
                              <Eye className="w-3 h-3" /> View
                            </a>
                          ) : <span className="text-gray-300">—</span>}
                        </Td>
                      </>
                    ) : null}

                    <Td className="text-center">{plaza.tollPlazaCfy || '—'}</Td>
                    <Td className="whitespace-nowrap">{plaza.trafficSurveyDate || '—'}</Td>
                    <Td className="text-center">{plaza.tollPlazaApc || '—'}</Td>

                    {pi === 0 ? (
                      <>
                        <Td rowSpan={plazaCount} className="text-red-600 max-w-[160px]">
                          <p className="line-clamp-2 leading-tight">{rec.rejectionRemarks || '—'}</p>
                        </Td>
                        <Td rowSpan={plazaCount} className="font-mono text-[11px] whitespace-nowrap">{rec.eOfficeFileNo || '—'}</Td>
                        <Td rowSpan={plazaCount}>{rec.piuFileStatus || '—'}</Td>
                        <Td rowSpan={plazaCount} className="font-mono text-[11px] whitespace-nowrap">{rec.divEfileNum || '—'}</Td>
                        <Td rowSpan={plazaCount}>{rec.coFileStatus || '—'}</Td>
                      </>
                    ) : null}
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 px-1">
            <p className="text-xs text-gray-500">
              Showing {pageOffset + 1}–{Math.min(pageOffset + (filters.pageSize ?? 10), data.pagination.total)} of {data.pagination.total} notifications
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={!data.pagination.hasPrev}
                onClick={() => setFilters({ page: (filters.page ?? 1) - 1 })}>← Prev</Button>
              <span className="text-xs text-gray-600 self-center px-2">
                Page {data.pagination.page} / {data.pagination.totalPages}
              </span>
              <Button size="sm" variant="outline" disabled={!data.pagination.hasNext}
                onClick={() => setFilters({ page: (filters.page ?? 1) + 1 })}>Next →</Button>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

// ─── Table helpers ────────────────────────────────────────────────────────────

const Th = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-3 py-2.5 text-left font-semibold text-white whitespace-nowrap border-r border-white/10 last:border-0 ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = '', rowSpan }: { children: React.ReactNode; className?: string; rowSpan?: number }) => (
  <td rowSpan={rowSpan} className={`px-3 py-2 text-gray-700 border-r border-gray-100 last:border-0 align-top ${className}`}>
    {children}
  </td>
);

// ─── Per-row action buttons (context-aware) ───────────────────────────────────
interface ActionButtonsProps {
  rec: TollNotification;
  navigate: (path: string) => void;
}

const ActionButtons = ({ rec, navigate }: ActionButtonsProps) => {
  const btns: { label: string; color: string; onClick: (e: React.MouseEvent) => void }[] = [];

  if (rec.status === 'DRAFT' || rec.status === 'REJECTED') {
    btns.push({
      label: 'Edit Toll Details',
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: (e) => { e.stopPropagation(); navigate(ROUTES.TOLL_NOTIFICATION.EDIT(rec.id)); },
    });
  }
  if (rec.status === 'SUBMITTED') {
    btns.push({
      label: 'Update E-Office No.',
      color: 'bg-amber-500 hover:bg-amber-600',
      onClick: (e) => { e.stopPropagation(); navigate(ROUTES.TOLL_NOTIFICATION.DETAIL(rec.id)); },
    });
  }
  if (rec.status === 'CO_REVIEWED') {
    btns.push({
      label: 'Update S.O. Number',
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: (e) => { e.stopPropagation(); navigate(ROUTES.TOLL_NOTIFICATION.SO_NUMBER(rec.id)); },
    });
  }
  if (rec.status === 'SO_ISSUED') {
    btns.push({
      label: 'Publish',
      color: 'bg-green-600 hover:bg-green-700',
      onClick: (e) => { e.stopPropagation(); navigate(ROUTES.TOLL_NOTIFICATION.DETAIL(rec.id)); },
    });
  }

  return (
    <div className="flex flex-col gap-1">
      {btns.map((b) => (
        <button
          key={b.label}
          onClick={b.onClick}
          className={`${b.color} text-white text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
};
