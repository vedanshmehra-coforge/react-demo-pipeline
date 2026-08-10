import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { ufaEmpanelmentApi } from '../api/ufa-empanelment.api';
import { toast } from '@store/ui.store';
import { getErrorMessage } from '@shared/utils/error';
import { eventBus } from '@core/event-bus/event-bus';
import type { CreateUfaEmpanelmentDto, UpdateUfaEmpanelmentDto } from '../types/ufa-empanelment.types';

export const useUfaEmpanelmentMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.ufaEmpanelment.all() });

  const create = useMutation({
    mutationFn: (dto: CreateUfaEmpanelmentDto) => ufaEmpanelmentApi.create(dto),
    onSuccess: () => { toast.success('UFA Empanelment created successfully'); invalidate(); },
    onError: (err) => toast.error('Failed to create', getErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUfaEmpanelmentDto }) =>
      ufaEmpanelmentApi.update(id, dto),
    onSuccess: () => { toast.success('UFA Empanelment updated successfully'); invalidate(); },
    onError: (err) => toast.error('Failed to update', getErrorMessage(err)),
  });

  const approve = useMutation({
    mutationFn: (id: string) => ufaEmpanelmentApi.approve(id),
    onSuccess: (res) => {
      toast.success('Empanelment approved');
      eventBus.emit('empanelment:approved', {
        empanelmentId: res.data.id,
        tollMasterId: res.data.tollMasterId,
      });
      invalidate();
    },
    onError: (err) => toast.error('Approval failed', getErrorMessage(err)),
  });

  const reject = useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks: string }) =>
      ufaEmpanelmentApi.reject(id, remarks),
    onSuccess: (res) => {
      toast.success('Empanelment rejected');
      eventBus.emit('empanelment:rejected', { empanelmentId: res.data.id });
      invalidate();
    },
    onError: (err) => toast.error('Rejection failed', getErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => ufaEmpanelmentApi.delete(id),
    onSuccess: () => { toast.success('UFA Empanelment deleted'); invalidate(); },
    onError: (err) => toast.error('Delete failed', getErrorMessage(err)),
  });

  return { create, update, approve, reject, remove };
};
