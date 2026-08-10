import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, FileText } from 'lucide-react';
import { PageHeader }   from '@shared/components/layout/page-header';
import { SectionCard }  from '@shared/components/layout/section-card';
import { PageLoader }   from '@shared/components/feedback/page-loader';
import { Button }       from '@shared/components/ui/button';
import { Input }        from '@shared/components/ui/input';
import { FormField }    from '@shared/components/form-fields/form-field';
import { ROUTES }       from '@shared/constants/routes';
import { useTollNotificationDetail }    from '../hooks/use-toll-notification-detail';
import { useTollNotificationMutations } from '../hooks/use-toll-notification-mutations';
import { NotificationStatusBadge }      from '../components/notification-status-badge/notification-status-badge';
import { updateSoNumberSchema, type UpdateSoNumberFormValues } from '../validation/toll-notification.schema';

export const TollNotificationSoNumberPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useTollNotificationDetail(id ?? '');
  const { updateSoNumber } = useTollNotificationMutations();

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateSoNumberFormValues>({
    resolver: zodResolver(updateSoNumberSchema),
    defaultValues: {
      notificationSoNumber:      data?.notificationSoNumber      ?? '',
      publishedTollNotification: data?.publishedTollNotification ?? '',
    },
  });

  const doSubmit = handleSubmit(async (values) => {
    await updateSoNumber.mutateAsync({ id: id ?? '', dto: values });
    navigate(ROUTES.TOLL_NOTIFICATION.DETAIL(id ?? ''));
  });

  if (isLoading) return <PageLoader />;
  if (!data) return <p className="text-gray-500 p-6">Notification not found.</p>;

  if (data.status !== 'CO_REVIEWED') {
    return (
      <div>
        <PageHeader title="Update S.O. Number" breadcrumbs={[
          { label: 'Home', href: ROUTES.DASHBOARD },
          { label: 'Toll Notifications', href: ROUTES.TOLL_NOTIFICATION.LIST },
          { label: data.upc, href: ROUTES.TOLL_NOTIFICATION.DETAIL(data.id) },
          { label: 'S.O. Number' },
        ]} />
        <SectionCard>
          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              S.O. Number can only be updated when status is <strong>E-Office Updated By CO</strong>.
              Current status: <strong>{data.statusLabel}</strong>.
            </p>
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Update Notification S.O. Number"
        description={data.projectName}
        breadcrumbs={[
          { label: 'Home', href: ROUTES.DASHBOARD },
          { label: 'Toll Notifications', href: ROUTES.TOLL_NOTIFICATION.LIST },
          { label: data.upc, href: ROUTES.TOLL_NOTIFICATION.DETAIL(data.id) },
          { label: 'S.O. Number' },
        ]}
        actions={<NotificationStatusBadge status={data.status} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Enter the Notification S.O. Number issued by the gazette. After saving, status moves to <strong>S.O. Number Updated</strong> and the notification can be published.
            </p>
          </div>

          <SectionCard title="Notification S.O. Number Details">
            <form onSubmit={doSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Notification S.O. Number" htmlFor="soNumber" error={errors.notificationSoNumber?.message} required hint="e.g. S.O. 3448(E)">
                  <Input id="soNumber" placeholder="e.g. S.O. 3448(E)" error={!!errors.notificationSoNumber} {...register('notificationSoNumber')} />
                </FormField>
                <FormField label="Published Toll Notification (Document)" htmlFor="pubDoc">
                  <Input id="pubDoc" placeholder="Document filename / reference" {...register('publishedTollNotification')} />
                </FormField>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => navigate(ROUTES.TOLL_NOTIFICATION.DETAIL(data.id))} disabled={updateSoNumber.isPending}>Cancel</Button>
                <Button type="submit" leftIcon={<FileText className="w-4 h-4" />} loading={updateSoNumber.isPending}>Issue S.O. Number</Button>
              </div>
            </form>
          </SectionCard>
        </div>

        <SectionCard title="Notification Summary">
          <dl className="space-y-3 text-sm">
            <div><dt className="text-xs text-gray-500 font-medium">UPC</dt><dd className="font-mono text-blue-700 font-semibold mt-0.5">{data.upc}</dd></div>
            <div><dt className="text-xs text-gray-500 font-medium">Project</dt><dd className="text-gray-800 mt-0.5 leading-snug">{data.projectName}</dd></div>
            <div><dt className="text-xs text-gray-500 font-medium">PIU</dt><dd className="text-gray-800 mt-0.5">{data.piuName}</dd></div>
            <div><dt className="text-xs text-gray-500 font-medium">RO</dt><dd className="text-gray-800 mt-0.5">{data.roName}</dd></div>
            <div><dt className="text-xs text-gray-500 font-medium">PIU E-File No.</dt><dd className="font-mono text-gray-800 mt-0.5">{data.eOfficeFileNo || '—'}</dd></div>
            <div><dt className="text-xs text-gray-500 font-medium">CO E-File No.</dt><dd className="font-mono text-gray-800 mt-0.5">{data.divEfileNum || '—'}</dd></div>
            <div>
              <dt className="text-xs text-gray-500 font-medium">Toll Plazas</dt>
              <dd className="mt-1 space-y-1">
                {data.tollPlazas.map((p) => (
                  <p key={p.id} className="text-xs text-gray-700">• {p.nameOfTollPlaza} ({p.noOfTollLane})</p>
                ))}
              </dd>
            </div>
          </dl>
        </SectionCard>
      </div>
    </div>
  );
};
