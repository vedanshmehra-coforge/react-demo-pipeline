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
import { useUfaEmpanelmentList } from '../hooks/use-ufa-empanelment-list';
import { useUfaEmpanelmentFiltersStore } from '../store/ufa-empanelment-filters.store';
import type { UfaEmpanelment } from '../types/ufa-empanelment.types';
import type { Column } from '@shared/components/data-table/data-table';

const columns: Column<UfaEmpanelment>[] = [
  { key: 'referenceNo', header: 'Reference No',  cell: (r) => r.referenceNo },
  { key: 'agencyName',  header: 'Agency Name',   cell: (r) => r.agencyName, className: 'max-w-xs truncate' },
  { key: 'agencyCode',  header: 'Agency Code',   cell: (r) => r.agencyCode },
  { key: 'status',      header: 'Status',        cell: (r) => <StatusBadge status={r.status} /> },
  { key: 'createdAt',   header: 'Created',       cell: (r) => formatDate(r.createdAt) },
];

export const UfaEmpanelmentListPage = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const { filters, setFilters } = useUfaEmpanelmentFiltersStore();
  const [search, setSearch] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(search, 400);
  const { data, isLoading } = useUfaEmpanelmentList({ ...filters, search: debouncedSearch });

  return (
    <div>
      <PageHeader
        title="UFA Empanelment"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'UFA Empanelment' }]}
        actions={
          hasPermission('ufa-empanelment:create') && (
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate(ROUTES.UFA_EMPANELMENT.CREATE)}>
              New Empanelment
            </Button>
          )
        }
      />
      <SectionCard
        actions={
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setFilters({ search: v }); }}
            placeholder="Search UFA Empanelment..."
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
          onRowClick={(r) => navigate(ROUTES.UFA_EMPANELMENT.DETAIL(r.id))}
        />
      </SectionCard>
    </div>
  );
};
