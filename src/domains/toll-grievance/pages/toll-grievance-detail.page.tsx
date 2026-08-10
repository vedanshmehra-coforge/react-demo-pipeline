import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { PageHeader } from '@shared/components/layout/page-header';
import { SectionCard } from '@shared/components/layout/section-card';
import { StatusBadge } from '@shared/components/feedback/status-badge';
import { Button } from '@shared/components/ui/button';
import { PageLoader } from '@shared/components/feedback/page-loader';
import { usePermissions } from '@shared/hooks/use-permissions';
import { formatDateTime } from '@shared/utils/format';
import { ROUTES } from '@shared/constants/routes';
import { useAuthStore } from '@store/auth.store';
import { useTollGrievanceDetail } from '../hooks/use-toll-grievance-detail';
import { useTollGrievanceMutations } from '../hooks/use-toll-grievance-mutations';
import { tollGrievanceService } from '../services/toll-grievance.service';

export const TollGrievanceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { hasPermission } = usePermissions();
  const { data, isLoading } = useTollGrievanceDetail(id ?? '');
  const { resolve, reject } = useTollGrievanceMutations();

  if (isLoading) return <PageLoader />;
  if (!data || !user) return <p className="text-gray-500 p-4">Record not found.</p>;

  const canResolve = hasPermission('toll-grievance:resolve') && tollGrievanceService.canResolve(data, user);

  return (
    <div>
      <PageHeader
        title={data.referenceNo}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Toll Grievance', href: ROUTES.TOLL_GRIEVANCE.LIST },
          { label: data.referenceNo },
        ]}
        actions={
          <div className="flex gap-2">
            {canResolve && (
              <>
                <Button variant="primary" size="sm" leftIcon={<CheckCircle className="w-4 h-4" />}
                  loading={resolve.isPending} onClick={() => resolve.mutate(data.id)}>
                  Resolve
                </Button>
                <Button variant="danger" size="sm" leftIcon={<XCircle className="w-4 h-4" />}
                  loading={reject.isPending}
                  onClick={() => reject.mutate({ id: data.id, remarks: 'Rejected by officer' })}>
                  Reject
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        }
      />
      <SectionCard title="Grievance Details" actions={<StatusBadge status={data.status} />}>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><dt className="text-xs text-gray-500 font-medium">Reference No</dt><dd className="text-sm text-gray-800 mt-0.5">{data.referenceNo}</dd></div>
          <div><dt className="text-xs text-gray-500 font-medium">Title</dt><dd className="text-sm text-gray-800 mt-0.5">{data.title}</dd></div>
          <div><dt className="text-xs text-gray-500 font-medium">Description</dt><dd className="text-sm text-gray-800 mt-0.5">{data.description ?? '—'}</dd></div>
          <div><dt className="text-xs text-gray-500 font-medium">Remarks</dt><dd className="text-sm text-gray-800 mt-0.5">{data.remarks ?? '—'}</dd></div>
          <div><dt className="text-xs text-gray-500 font-medium">Submitted At</dt><dd className="text-sm text-gray-800 mt-0.5">{formatDateTime(data.createdAt)}</dd></div>
          <div><dt className="text-xs text-gray-500 font-medium">Updated At</dt><dd className="text-sm text-gray-800 mt-0.5">{formatDateTime(data.updatedAt)}</dd></div>
        </dl>
      </SectionCard>
    </div>
  );
};
