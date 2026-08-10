import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Send, Globe, Trash2, CheckCircle, XCircle, FileText } from 'lucide-react';
import { PageHeader }   from '@shared/components/layout/page-header';
import { SectionCard }  from '@shared/components/layout/section-card';
import { Button }       from '@shared/components/ui/button';
import { PageLoader }   from '@shared/components/feedback/page-loader';
import { ROUTES }       from '@shared/constants/routes';
import { formatDate }   from '@shared/utils/format';
import { useAuthStore } from '@store/auth.store';
import { useTollNotificationDetail }    from '../hooks/use-toll-notification-detail';
import { useTollNotificationMutations } from '../hooks/use-toll-notification-mutations';
import { tollNotificationService }      from '../services/toll-notification.service';
import { NotificationStatusBadge }      from '../components/notification-status-badge/notification-status-badge';
import { WorkflowStepper }              from '../components/workflow-stepper/workflow-stepper';
import { UpdateEOfficeModal }           from '../components/update-eoffice-modal/update-eoffice-modal';
import { RejectModal }                  from '../components/reject-modal/reject-modal';
import type { UpdateEOfficeFormValues } from '../validation/toll-notification.schema';

export const TollNotificationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user)!;

  const { data, isLoading } = useTollNotificationDetail(id ?? '');
  const { submit, updateEOfficeNumber, publish, reject, remove } = useTollNotificationMutations();

  const [showEOfficeModal, setShowEOfficeModal] = useState(false);
  const [showRejectModal,  setShowRejectModal]  = useState(false);

  if (isLoading) return <PageLoader />;
  if (!data)     return <p className="text-gray-500 p-6">Notification not found.</p>;

  const isCo = tollNotificationService.isCo(user);

  const actions = (
    <div className="flex flex-wrap gap-2">
      {tollNotificationService.canPiuEdit(data) && (
        <Button size="sm" variant="outline" leftIcon={<Edit className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.TOLL_NOTIFICATION.EDIT(data.id))}>
          Edit Toll Details
        </Button>
      )}
      {tollNotificationService.canPiuSubmit(data) && data.status === 'DRAFT' && (
        <Button size="sm" leftIcon={<Send className="w-4 h-4" />}
          loading={submit.isPending} onClick={() => submit.mutate(data.id)}>
          Submit to CO-Division
        </Button>
      )}
      {isCo && tollNotificationService.canCoUpdateEOffice(data) && (
        <Button size="sm" leftIcon={<CheckCircle className="w-4 h-4" />}
          onClick={() => setShowEOfficeModal(true)}>
          Update E-Office File Number
        </Button>
      )}
      {isCo && tollNotificationService.canCoUpdateSoNumber(data) && (
        <Button size="sm" leftIcon={<FileText className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.TOLL_NOTIFICATION.SO_NUMBER(data.id))}>
          Update Notification S.O. Number
        </Button>
      )}
      {isCo && tollNotificationService.canCoPublish(data) && (
        <Button size="sm" variant="primary" leftIcon={<Globe className="w-4 h-4" />}
          loading={publish.isPending} onClick={() => publish.mutate(data.id)}>
          Publish Notification
        </Button>
      )}
      {isCo && tollNotificationService.canCoReject(data) && (
        <Button size="sm" variant="danger" leftIcon={<XCircle className="w-4 h-4" />}
          onClick={() => setShowRejectModal(true)}>Reject</Button>
      )}
      {tollNotificationService.canPiuDelete(data) && (
        <Button size="sm" variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}
          loading={remove.isPending}
          onClick={async () => {
            if (!window.confirm(`Delete notification for ${data.upc}?`)) return;
            await remove.mutateAsync(data.id);
            navigate(ROUTES.TOLL_NOTIFICATION.LIST);
          }}>
          Delete
        </Button>
      )}
      <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate(ROUTES.TOLL_NOTIFICATION.LIST)}>Back</Button>
    </div>
  );

  return (
    <div>
      <PageHeader
        title={data.upc}
        description={data.projectName}
        breadcrumbs={[
          { label: 'Home', href: ROUTES.DASHBOARD },
          { label: 'Toll Notifications', href: ROUTES.TOLL_NOTIFICATION.LIST },
          { label: data.upc },
        ]}
        actions={actions}
      />

      {/* Workflow stepper */}
      <SectionCard className="mb-4">
        <WorkflowStepper status={data.status} />
        {data.status === 'REJECTED' && data.rejectionRemarks && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-red-600 mb-0.5">Rejection Reason</p>
            <p className="text-sm text-red-700">{data.rejectionRemarks}</p>
          </div>
        )}
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: main info */}
        <div className="lg:col-span-2 space-y-4">

          {/* Project details */}
          <SectionCard title="Project Details" actions={<NotificationStatusBadge status={data.status} />}>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Dl label="UPC"><span className="font-mono font-bold text-blue-700">{data.upc}</span></Dl>
              <Dl label="Project Name"><span className="leading-snug">{data.projectName}</span></Dl>
              <Dl label="PIU">{data.piuName}</Dl>
              <Dl label="RO">{data.roName}</Dl>
              <Dl label="Toll Mode">{data.tollMode}</Dl>
              <Dl label="Plaza Type">{data.plazaType}</Dl>
              <Dl label="Appointed Date">{data.appointedDate || '—'}</Dl>
              <Dl label="Physical Progress">{data.physicalProgress ? `${data.physicalProgress}%` : '—'}</Dl>
            </dl>
          </SectionCard>

          {/* Toll Plaza table */}
          <SectionCard title={`Toll Plazas (${data.tollPlazas.length})`} noPadding>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['S.No.','Name','Location','Lanes','Temp ID','Perm ID','CFY (PCU)','Survey Date','APC'].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.tollPlazas.map((p, i) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                      <td className="px-3 py-2 font-medium text-gray-800 whitespace-nowrap">{p.nameOfTollPlaza || '—'}</td>
                      <td className="px-3 py-2 text-gray-600 max-w-[180px]"><p className="line-clamp-2">{p.locationOfTollPlaza || '—'}</p></td>
                      <td className="px-3 py-2 text-center">{p.noOfTollLane || '—'}</td>
                      <td className="px-3 py-2 font-mono text-[10px] whitespace-nowrap">{p.tempTollPlazaId || '—'}</td>
                      <td className="px-3 py-2 font-mono text-[10px]">{p.permanentTollPlazaId || '—'}</td>
                      <td className="px-3 py-2 text-center">{p.tollPlazaCfy || '—'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{p.trafficSurveyDate || '—'}</td>
                      <td className="px-3 py-2 text-center">{p.tollPlazaApc || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* E-Office details */}
          <SectionCard title="E-Office / File Details">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Dl label="PIU E-File No."><span className="font-mono">{data.eOfficeFileNo || '—'}</span></Dl>
              <Dl label="PIU File Status">{data.piuFileStatus || '—'}</Dl>
              <Dl label="CO E-File No."><span className="font-mono">{data.divEfileNum || '—'}</span></Dl>
              <Dl label="CO File Status">{data.coFileStatus || '—'}</Dl>
              {data.notificationSoNumber && (
                <Dl label="Notification S.O. Number">
                  <span className="font-mono font-semibold text-purple-700">{data.notificationSoNumber}</span>
                </Dl>
              )}
              {data.documentName && (
                <Dl label="Notification Letter">
                  <a href="#" className="text-blue-600 hover:underline text-xs">{data.documentName}</a>
                </Dl>
              )}
              {data.remarkMain && (
                <div className="sm:col-span-2">
                  <Dl label="Remarks">{data.remarkMain}</Dl>
                </div>
              )}
            </dl>
          </SectionCard>
        </div>

        {/* Right: next action + dates */}
        <div className="space-y-4">
          {tollNotificationService.getNextActionLabel(data, user) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-600 mb-1">Next Action Required</p>
              <p className="text-sm text-blue-800 font-medium">{tollNotificationService.getNextActionLabel(data, user)}</p>
            </div>
          )}

          <SectionCard title="Record Info">
            <dl className="space-y-3 text-sm">
              <Dl label="Status"><NotificationStatusBadge status={data.status} /></Dl>
              <Dl label="Status Label">{data.statusLabel}</Dl>
              <Dl label="Appointed Date">{data.appointedDate || '—'}</Dl>
              <Dl label="Created">{formatDate(data.createdAt)}</Dl>
              <Dl label="Last Updated">{formatDate(data.updatedAt)}</Dl>
            </dl>
          </SectionCard>
        </div>
      </div>

      {/* Modals */}
      {showEOfficeModal && (
        <UpdateEOfficeModal
          notification={data}
          onConfirm={async (dto: UpdateEOfficeFormValues) => {
            await updateEOfficeNumber.mutateAsync({ id: data.id, dto });
            setShowEOfficeModal(false);
          }}
          onClose={() => setShowEOfficeModal(false)}
          isLoading={updateEOfficeNumber.isPending}
        />
      )}
      {showRejectModal && (
        <RejectModal
          upc={data.upc}
          onConfirm={async (remarks) => {
            await reject.mutateAsync({ id: data.id, dto: { rejectionRemarks: remarks } });
            setShowRejectModal(false);
          }}
          onClose={() => setShowRejectModal(false)}
          isLoading={reject.isPending}
        />
      )}
    </div>
  );
};

const Dl = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <dt className="text-xs text-gray-500 font-medium">{label}</dt>
    <dd className="text-sm text-gray-800 mt-0.5">{children}</dd>
  </div>
);
