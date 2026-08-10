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
import { useForceMajeureList } from '../hooks/use-force-majeure-claim-list';
import { useForceMajeureFiltersStore } from '../store/force-majeure-claim-filters.store';
import type { ForceMajeure } from '../types/force-majeure-claim.types';
import type { Column } from '@shared/components/data-table/data-table';
import { useState } from 'react';

const columns: Column<ForceMajeure>[] = [
  { key: 'referenceNo', header: 'Reference No', cell: (r) => r.referenceNo },
  { key: 'title',       header: 'Title',        cell: (r) => r.title, className: 'max-w-xs truncate' },
  { key: 'status',      header: 'Status',       cell: (r) => <StatusBadge status={r.status} /> },
  { key: 'createdAt',   header: 'Created',      cell: (r) => formatDate(r.createdAt) },
];

export const ForceMajeureListPage = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const { filters, setFilters } = useForceMajeureFiltersStore();
  const [search, setSearch] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useForceMajeureList({ ...filters, search: debouncedSearch });

  return (
    <div>
      <PageHeader
        title="Force Majeure Claim"
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Force Majeure Claim' }]}
        actions={
          hasPermission('force-majeure:create' as never) && (
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate(ROUTES.FORCE_MAJEURE.CREATE)}>
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
            placeholder="Search Force Majeure Claim..."
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
          onRowClick={(r) => navigate(ROUTES.FORCE_MAJEURE.DETAIL(r.id))}
        />
      </SectionCard>
    </div>
  );
};
