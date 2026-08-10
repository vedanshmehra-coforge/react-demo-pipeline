import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader } from '@shared/components/layout/page-header';
import { SectionCard } from '@shared/components/layout/section-card';
import { DataTable } from '@shared/components/data-table/data-table';
import { StatusBadge } from '@shared/components/feedback/status-badge';
import { Button } from '@shared/components/ui/button';
import { SearchInput } from '@shared/components/form-fields/search-input';
import { usePermissions } from '@shared/hooks/use-permissions';
import { useDebounce } from '@shared/hooks/use-debounce';
import { formatDate } from '@shared/utils/format';
import { ROUTES } from '@shared/constants/routes';
import { useTollGrievanceList } from '../hooks/use-toll-grievance-list';
import { useTollGrievanceFiltersStore } from '../store/toll-grievance-filters.store';
import type { TollGrievance } from '../types/toll-grievance.types';
import type { Column } from '@shared/components/data-table/data-table';

const columns: Column<TollGrievance>[] = [
  { key: 'referenceNo', header: 'Reference No', cell: (r) => r.referenceNo },
  { key: 'title',       header: 'Title',        cell: (r) => r.title, className: 'max-w-xs truncate' },
  { key: 'status',      header: 'Status',       cell: (r) => <StatusBadge status={r.status} /> },
  { key: 'createdAt',   header: 'Submitted',    cell: (r) => formatDate(r.createdAt) },
];

export const TollGrievanceListPage = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const { filters, setFilters } = useTollGrievanceFiltersStore();
  const [search, setSearch] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(search, 400);
  const { data, isLoading } = useTollGrievanceList({ ...filters, search: debouncedSearch });

  return (
    <div>
      <PageHeader
        title="Toll Grievance"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Toll Grievance' }]}
        actions={
          hasPermission('toll-grievance:create') && (
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate(ROUTES.TOLL_GRIEVANCE.CREATE)}>
              New Grievance
            </Button>
          )
        }
      />
      <SectionCard
        actions={
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setFilters({ search: v }); }}
            placeholder="Search Toll Grievance..."
            className="w-64"
          />
        }
      >
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          loading={isLoading}
          pagination={data?.pagination}
          onPageChange={(p) => setFilters({ page: p })}
          rowKey={(r) => r.id}
          onRowClick={(r) => navigate(ROUTES.TOLL_GRIEVANCE.DETAIL(r.id))}
        />
      </SectionCard>
    </div>
  );
};
