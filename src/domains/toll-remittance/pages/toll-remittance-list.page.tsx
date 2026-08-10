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
import { useTollRemittanceList } from '../hooks/use-toll-remittance-list';
import { useTollRemittanceFiltersStore } from '../store/toll-remittance-filters.store';
import type { TollRemittance } from '../types/toll-remittance.types';
import type { Column } from '@shared/components/data-table/data-table';
import { useState } from 'react';

const columns: Column<TollRemittance>[] = [
  { key: 'referenceNo', header: 'Reference No', cell: (r) => r.referenceNo },
  { key: 'title',       header: 'Title',        cell: (r) => r.title, className: 'max-w-xs truncate' },
  { key: 'status',      header: 'Status',       cell: (r) => <StatusBadge status={r.status} /> },
  { key: 'createdAt',   header: 'Created',      cell: (r) => formatDate(r.createdAt) },
];

export const TollRemittanceListPage = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const { filters, setFilters } = useTollRemittanceFiltersStore();
  const [search, setSearch] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useTollRemittanceList({ ...filters, search: debouncedSearch });

  return (
    <div>
      <PageHeader
        title="Toll Remittance"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Toll Remittance' }]}
        actions={
          hasPermission('toll-remittance:create' as never) && (
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate(ROUTES.TOLL_REMITTANCE.CREATE)}>
              New Record
            </Button>
          )
        }
      />
      <SectionCard
        actions={
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setFilters({ search: v }); }}
            placeholder="Search Toll Remittance..."
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
          onRowClick={(r) => navigate(ROUTES.TOLL_REMITTANCE.DETAIL(r.id))}
        />
      </SectionCard>
    </div>
  );
};
