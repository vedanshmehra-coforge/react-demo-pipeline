import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollNotificationMockStore } from '../mock/toll-notification.mock';
import { toast } from '@store/ui.store';
import { useAuthStore } from '@store/auth.store';
import type { TollNotification } from '../types/toll-notification.types';
import type {
  UpdateEOfficeFormValues,
  UpdateSoNumberFormValues,
  RejectFormValues,
  CreateTollNotificationFormValues,
} from '../validation/toll-notification.schema';

export const useTollNotificationMutations = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.tollNotification.all() });

  // ── PIU: Create ─────────────────────────────────────────────────────────
  const create = useMutation({
    mutationFn: (dto: CreateTollNotificationFormValues) => {
      const record = tollNotificationMockStore.create({
        ...dto,
        tollNotificationId: '',
        piuName: dto.piuName || user?.fullName || 'PIU User',
        roName:  dto.roName  || 'RO',
        publishedTollNotification: '',
        piuFileStatus: '',
        divEfileNum: '',
        coFileStatus: '',
        notificationSoNumber: '',
        status: 'DRAFT',
        statusCode: '6666',
        statusLabel: 'Draft',
        rejectionRemarks: '',
        remarkMain: '',
        upcFlag: '0',
        isPlazaNameEditedOnce: false,
        tollPlazas: dto.tollPlazas.map((p, i) => ({ ...p, id: String(Date.now() + i) })),
      } as Omit<TollNotification, 'id' | 'tollNotificationId' | 'createdAt' | 'updatedAt'>);
      return Promise.resolve(record);
    },
    onSuccess: () => { toast.success('Notification saved as draft'); invalidate(); },
    onError: () => toast.error('Failed to save notification'),
  });

  // ── PIU: Update ─────────────────────────────────────────────────────────
  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<TollNotification> }) => {
      const record = tollNotificationMockStore.update(id, dto);
      if (!record) throw new Error('Not found');
      return Promise.resolve(record);
    },
    onSuccess: () => { toast.success('Notification updated'); invalidate(); },
    onError: () => toast.error('Failed to update'),
  });

  // ── PIU: Submit ─────────────────────────────────────────────────────────
  const submit = useMutation({
    mutationFn: (id: string) => {
      const record = tollNotificationMockStore.submit(id);
      if (!record) throw new Error('Not found');
      return Promise.resolve(record);
    },
    onSuccess: () => { toast.success('Notification submitted to CO-Division'); invalidate(); },
    onError: () => toast.error('Failed to submit'),
  });

  // ── CO: Update E-Office ─────────────────────────────────────────────────
  const updateEOfficeNumber = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateEOfficeFormValues }) => {
      const record = tollNotificationMockStore.updateEOfficeNumber(id, dto);
      if (!record) throw new Error('Not found');
      return Promise.resolve(record);
    },
    onSuccess: () => { toast.success('CO E-File Number updated'); invalidate(); },
    onError: () => toast.error('Failed to update E-Office number'),
  });

  // ── CO: Update S.O. Number ───────────────────────────────────────────────
  const updateSoNumber = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSoNumberFormValues }) => {
      const record = tollNotificationMockStore.updateSoNumber(id, dto);
      if (!record) throw new Error('Not found');
      return Promise.resolve(record);
    },
    onSuccess: () => { toast.success('S.O. Number issued'); invalidate(); },
    onError: () => toast.error('Failed to update S.O. Number'),
  });

  // ── CO: Reject ───────────────────────────────────────────────────────────
  const reject = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: RejectFormValues }) => {
      const record = tollNotificationMockStore.reject(id, dto.rejectionRemarks);
      if (!record) throw new Error('Not found');
      return Promise.resolve(record);
    },
    onSuccess: () => { toast.success('Notification rejected'); invalidate(); },
    onError: () => toast.error('Failed to reject'),
  });

  // ── CO: Publish ─────────────────────────────────────────────────────────
  const publish = useMutation({
    mutationFn: (id: string) => {
      const record = tollNotificationMockStore.publish(id);
      if (!record) throw new Error('Not found');
      return Promise.resolve(record);
    },
    onSuccess: () => { toast.success('Notification published'); invalidate(); },
    onError: () => toast.error('Failed to publish'),
  });

  // ── Delete ──────────────────────────────────────────────────────────────
  const remove = useMutation({
    mutationFn: (id: string) => {
      tollNotificationMockStore.delete(id);
      return Promise.resolve();
    },
    onSuccess: () => { toast.success('Notification deleted'); invalidate(); },
    onError: () => toast.error('Failed to delete'),
  });

  return { create, update, submit, updateEOfficeNumber, updateSoNumber, reject, publish, remove };
};
