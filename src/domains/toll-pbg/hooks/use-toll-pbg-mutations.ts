import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollPbgApi } from '../api/toll-pbg.api';
import { toast } from '@store/ui.store';
import { getErrorMessage } from '@shared/utils/error';
import type { CreateTollPbgDto, UpdateTollPbgDto } from '../types/toll-pbg.types';

export const useTollPbgMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.tollPbg.all() });

  const create = useMutation({
    mutationFn: (dto: CreateTollPbgDto) => tollPbgApi.create(dto),
    onSuccess: () => { toast.success('Toll PBG created successfully'); invalidate(); },
    onError: (err) => toast.error('Failed to create', getErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTollPbgDto }) =>
      tollPbgApi.update(id, dto),
    onSuccess: () => { toast.success('Toll PBG updated successfully'); invalidate(); },
    onError: (err) => toast.error('Failed to update', getErrorMessage(err)),
  });

  const approve = useMutation({
    mutationFn: (id: string) => tollPbgApi.approve(id),
    onSuccess: () => { toast.success('Record approved successfully'); invalidate(); },
    onError: (err) => toast.error('Approval failed', getErrorMessage(err)),
  });

  const reject = useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks: string }) =>
      tollPbgApi.reject(id, remarks),
    onSuccess: () => { toast.success('Record rejected'); invalidate(); },
    onError: (err) => toast.error('Rejection failed', getErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => tollPbgApi.delete(id),
    onSuccess: () => { toast.success('Toll PBG deleted'); invalidate(); },
    onError: (err) => toast.error('Delete failed', getErrorMessage(err)),
  });

  return { create, update, approve, reject, remove };
};
