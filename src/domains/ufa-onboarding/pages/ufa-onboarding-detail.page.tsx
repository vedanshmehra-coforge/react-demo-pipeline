import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@shared/components/layout/page-header';
import { SectionCard } from '@shared/components/layout/section-card';
import { StatusBadge } from '@shared/components/feedback/status-badge';
import { Button } from '@shared/components/ui/button';
import { PageLoader } from '@shared/components/feedback/page-loader';
import { formatDateTime } from '@shared/utils/format';
import { ROUTES } from '@shared/constants/routes';
import { useUfaOnboardingDetail } from '../hooks/use-ufa-onboarding-detail';

export const UfaOnboardingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useUfaOnboardingDetail(id ?? '');

  if (isLoading) return <PageLoader />;
  if (!data) return <p className="text-gray-500 p-4">Record not found.</p>;

  return (
    <div>
      <PageHeader
        title={data.referenceNo}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'UFA Onboarding', href: ROUTES.UFA_ONBOARDING.LIST },
          { label: data.referenceNo },
        ]}
        actions={
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)}>
            Back
          </Button>
        }
      />
      <SectionCard title="Onboarding Details" actions={<StatusBadge status={data.status} />}>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><dt className="text-xs text-gray-500 font-medium">Reference No</dt><dd className="text-sm text-gray-800 mt-0.5">{data.referenceNo}</dd></div>
          <div><dt className="text-xs text-gray-500 font-medium">Agency Name</dt><dd className="text-sm text-gray-800 mt-0.5">{data.agencyName}</dd></div>
          <div><dt className="text-xs text-gray-500 font-medium">Description</dt><dd className="text-sm text-gray-800 mt-0.5">{data.description ?? '—'}</dd></div>
          <div><dt className="text-xs text-gray-500 font-medium">Remarks</dt><dd className="text-sm text-gray-800 mt-0.5">{data.remarks ?? '—'}</dd></div>
          <div><dt className="text-xs text-gray-500 font-medium">Created At</dt><dd className="text-sm text-gray-800 mt-0.5">{formatDateTime(data.createdAt)}</dd></div>
          <div><dt className="text-xs text-gray-500 font-medium">Updated At</dt><dd className="text-sm text-gray-800 mt-0.5">{formatDateTime(data.updatedAt)}</dd></div>
        </dl>
      </SectionCard>
    </div>
  );
};
