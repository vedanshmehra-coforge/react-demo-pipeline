import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollGrievanceApi } from '../api/toll-grievance.api';
import { toast } from '@store/ui.store';
import { getErrorMessage } from '@shared/utils/error';
import { eventBus } from '@core/event-bus/event-bus';
import type { CreateTollGrievanceDto, UpdateTollGrievanceDto } from '../types/toll-grievance.types';

export const useTollGrievanceMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.tollGrievance.all() });

  const create = useMutation({
    mutationFn: (dto: CreateTollGrievanceDto) => tollGrievanceApi.create(dto),
    onSuccess: () => {
      toast.success('Grievance submitted successfully');
      eventBus.emit('grievance:submitted', { grievanceId: '' });
      invalidate();
    },
    onError: (err) => toast.error('Failed to submit grievance', getErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTollGrievanceDto }) =>
      tollGrievanceApi.update(id, dto),
    onSuccess: () => { toast.success('Grievance updated'); invalidate(); },
    onError: (err) => toast.error('Failed to update', getErrorMessage(err)),
  });

  const resolve = useMutation({
    mutationFn: (id: string) => tollGrievanceApi.approve(id),
    onSuccess: (res) => {
      toast.success('Grievance resolved');
      eventBus.emit('grievance:resolved', { grievanceId: res.data.id });
      invalidate();
    },
    onError: (err) => toast.error('Failed to resolve', getErrorMessage(err)),
  });

  const reject = useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks: string }) =>
      tollGrievanceApi.reject(id, remarks),
    onSuccess: () => { toast.success('Grievance rejected'); invalidate(); },
    onError: (err) => toast.error('Rejection failed', getErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => tollGrievanceApi.delete(id),
    onSuccess: () => { toast.success('Grievance deleted'); invalidate(); },
    onError: (err) => toast.error('Delete failed', getErrorMessage(err)),
  });

  return { create, update, resolve, reject, remove };
};
