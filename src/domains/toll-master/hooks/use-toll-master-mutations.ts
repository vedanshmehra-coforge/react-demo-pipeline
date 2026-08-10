import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollMasterApi } from '../api/toll-master.api';
import { toast } from '@store/ui.store';
import { getErrorMessage } from '@shared/utils/error';
import type { CreateTollMasterDto, UpdateTollMasterDto } from '../types/toll-master.types';

export const useTollMasterMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.tollMaster.all() });

  const create = useMutation({
    mutationFn: (dto: CreateTollMasterDto) => tollMasterApi.create(dto),
    onSuccess: () => { toast.success('Toll Master created successfully'); invalidate(); },
    onError: (err) => toast.error('Failed to create', getErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTollMasterDto }) =>
      tollMasterApi.update(id, dto),
    onSuccess: () => { toast.success('Toll Master updated successfully'); invalidate(); },
    onError: (err) => toast.error('Failed to update', getErrorMessage(err)),
  });

  const approve = useMutation({
    mutationFn: (id: string) => tollMasterApi.approve(id),
    onSuccess: () => { toast.success('Record approved successfully'); invalidate(); },
    onError: (err) => toast.error('Approval failed', getErrorMessage(err)),
  });

  const reject = useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks: string }) =>
      tollMasterApi.reject(id, remarks),
    onSuccess: () => { toast.success('Record rejected'); invalidate(); },
    onError: (err) => toast.error('Rejection failed', getErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => tollMasterApi.delete(id),
    onSuccess: () => { toast.success('Toll Master deleted'); invalidate(); },
    onError: (err) => toast.error('Delete failed', getErrorMessage(err)),
  });

  return { create, update, approve, reject, remove };
};
