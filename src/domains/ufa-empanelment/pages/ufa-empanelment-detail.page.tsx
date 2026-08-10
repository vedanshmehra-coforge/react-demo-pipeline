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
import { useUfaEmpanelmentDetail } from '../hooks/use-ufa-empanelment-detail';
import { useUfaEmpanelmentMutations } from '../hooks/use-ufa-empanelment-mutations';
import { ufaEmpanelmentService } from '../services/ufa-empanelment.service';
import { useAuthStore } from '@store/auth.store';

export const UfaEmpanelmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { hasPermission } = usePermissions();
  const { data, isLoading } = useUfaEmpanelmentDetail(id ?? '');
  const { approve, reject } = useUfaEmpanelmentMutations();

  if (isLoading) return <PageLoader />;
  if (!data || !user) return <p className="text-gray-500 p-4">Record not found.</p>;

  const canApprove = hasPermission('ufa-empanelment:approve') && ufaEmpanelmentService.canApprove(data, user);

  return (
    <div>
      <PageHeader
        title={data.referenceNo}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'UFA Empanelment', href: ROUTES.UFA_EMPANELMENT.LIST },
          { label: data.referenceNo },
        ]}
        actions={
          <div className="flex gap-2">
            {canApprove && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                  loading={approve.isPending}
                  onClick={() => approve.mutate(data.id)}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<XCircle className="w-4 h-4" />}
                  loading={reject.isPending}
                  onClick={() => reject.mutate({ id: data.id, remarks: 'Rejected by officer' })}
                >
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
      <SectionCard title="Empanelment Details" actions={<StatusBadge status={data.status} />}>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><dt className="text-xs text-gray-500 font-medium">Reference No</dt><dd className="text-sm text-gray-800 mt-0.5">{data.referenceNo}</dd></div>
          <div><dt className="text-xs text-gray-500 font-medium">Agency Name</dt><dd className="text-sm text-gray-800 mt-0.5">{data.agencyName}</dd></div>
          <div><dt className="text-xs text-gray-500 font-medium">Agency Code</dt><dd className="text-sm text-gray-800 mt-0.5">{data.agencyCode}</dd></div>
          <div><dt className="text-xs text-gray-500 font-medium">Description</dt><dd className="text-sm text-gray-800 mt-0.5">{data.description ?? '—'}</dd></div>
          <div><dt className="text-xs text-gray-500 font-medium">Remarks</dt><dd className="text-sm text-gray-800 mt-0.5">{data.remarks ?? '—'}</dd></div>
          <div><dt className="text-xs text-gray-500 font-medium">Created At</dt><dd className="text-sm text-gray-800 mt-0.5">{formatDateTime(data.createdAt)}</dd></div>
        </dl>
      </SectionCard>
    </div>
  );
};
