import { useNavigate, useParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { PageHeader }   from '@shared/components/layout/page-header';
import { SectionCard }  from '@shared/components/layout/section-card';
import { PageLoader }   from '@shared/components/feedback/page-loader';
import { ROUTES }       from '@shared/constants/routes';
import { useTollNotificationDetail }    from '../hooks/use-toll-notification-detail';
import { useTollNotificationMutations } from '../hooks/use-toll-notification-mutations';
import { tollNotificationService }      from '../services/toll-notification.service';
import { NotificationForm }             from '../components/notification-form/notification-form';
import { NotificationStatusBadge }      from '../components/notification-status-badge/notification-status-badge';
import type { CreateTollNotificationFormValues } from '../validation/toll-notification.schema';
import type { TollNotification } from '../types/toll-notification.types';

export const TollNotificationEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useTollNotificationDetail(id ?? '');
  const { update, submit } = useTollNotificationMutations();

  if (isLoading) return <PageLoader />;
  if (!data) return <p className="text-gray-500 p-6">Notification not found.</p>;

  if (!tollNotificationService.canPiuEdit(data)) {
    return (
      <div>
        <PageHeader
          title={data.upc}
          breadcrumbs={[
            { label: 'Home', href: ROUTES.DASHBOARD },
            { label: 'Toll Notifications', href: ROUTES.TOLL_NOTIFICATION.LIST },
            { label: data.upc, href: ROUTES.TOLL_NOTIFICATION.DETAIL(data.id) },
            { label: 'Edit' },
          ]}
          actions={<NotificationStatusBadge status={data.status} />}
        />
        <SectionCard>
          <div className="flex flex-col items-center py-10 text-center">
            <Lock className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-base font-semibold text-gray-700 mb-1">Editing Disabled</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              This notification is <strong>{data.statusLabel}</strong>. Editing is only allowed for Draft or Rejected notifications.
            </p>
          </div>
        </SectionCard>
      </div>
    );
  }

  const handleSaveDraft = async (values: CreateTollNotificationFormValues) => {
    await update.mutateAsync({
      id: data.id,
      dto: values as unknown as Partial<TollNotification>,
    });
    navigate(ROUTES.TOLL_NOTIFICATION.DETAIL(data.id));
  };

  const handleSubmit = async (values: CreateTollNotificationFormValues) => {
    await update.mutateAsync({ id: data.id, dto: values as unknown as Partial<TollNotification> });
    await submit.mutateAsync(data.id);
    navigate(ROUTES.TOLL_NOTIFICATION.DETAIL(data.id));
  };

  return (
    <div>
      <PageHeader
        title={`Edit — ${data.upc}`}
        description={data.projectName}
        breadcrumbs={[
          { label: 'Home', href: ROUTES.DASHBOARD },
          { label: 'Toll Notifications', href: ROUTES.TOLL_NOTIFICATION.LIST },
          { label: data.upc, href: ROUTES.TOLL_NOTIFICATION.DETAIL(data.id) },
          { label: 'Edit' },
        ]}
        actions={<NotificationStatusBadge status={data.status} />}
      />
      <NotificationForm
        defaultValues={data}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        isSaving={update.isPending && !submit.isPending}
        isSubmitting={submit.isPending}
        onCancel={() => navigate(ROUTES.TOLL_NOTIFICATION.DETAIL(data.id))}
        rejectionRemarks={data.rejectionRemarks || null}
      />
    </div>
  );
};
