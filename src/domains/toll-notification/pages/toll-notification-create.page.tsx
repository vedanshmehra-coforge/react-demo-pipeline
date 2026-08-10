import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@shared/components/layout/page-header';
import { ROUTES } from '@shared/constants/routes';
import { useTollNotificationMutations } from '../hooks/use-toll-notification-mutations';
import { NotificationForm } from '../components/notification-form/notification-form';
import type { CreateTollNotificationFormValues } from '../validation/toll-notification.schema';

export const TollNotificationCreatePage = () => {
  const navigate = useNavigate();
  const { create, submit } = useTollNotificationMutations();

  const handleSaveDraft = async (values: CreateTollNotificationFormValues) => {
    const record = await create.mutateAsync(values);
    navigate(ROUTES.TOLL_NOTIFICATION.DETAIL(record.id));
  };

  const handleSubmit = async (values: CreateTollNotificationFormValues) => {
    // Create as draft first, then immediately submit
    const record = await create.mutateAsync(values);
    await submit.mutateAsync(record.id);
    navigate(ROUTES.TOLL_NOTIFICATION.DETAIL(record.id));
  };

  return (
    <div>
      <PageHeader
        title="New Toll Plaza Notification"
        description="Fill in the details below and submit to CO-Division for processing"
        breadcrumbs={[
          { label: 'Home',               href: ROUTES.DASHBOARD },
          { label: 'Toll Notifications', href: ROUTES.TOLL_NOTIFICATION.LIST },
          { label: 'New Notification' },
        ]}
      />

      <NotificationForm
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        isSaving={create.isPending && !submit.isPending}
        isSubmitting={submit.isPending}
        onCancel={() => navigate(ROUTES.TOLL_NOTIFICATION.LIST)}
      />
    </div>
  );
};
