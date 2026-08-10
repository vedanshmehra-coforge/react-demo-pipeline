import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { forceMajeureApi } from '../api/force-majeure-claim.api';
import { toast } from '@store/ui.store';
import { getErrorMessage } from '@shared/utils/error';
import type { CreateForceMajeureDto, UpdateForceMajeureDto } from '../types/force-majeure-claim.types';

export const useForceMajeureMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.forceMajeure.all() });

  const create = useMutation({
    mutationFn: (dto: CreateForceMajeureDto) => forceMajeureApi.create(dto),
    onSuccess: () => { toast.success('Force Majeure Claim created successfully'); invalidate(); },
    onError: (err) => toast.error('Failed to create', getErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateForceMajeureDto }) =>
      forceMajeureApi.update(id, dto),
    onSuccess: () => { toast.success('Force Majeure Claim updated successfully'); invalidate(); },
    onError: (err) => toast.error('Failed to update', getErrorMessage(err)),
  });

  const approve = useMutation({
    mutationFn: (id: string) => forceMajeureApi.approve(id),
    onSuccess: () => { toast.success('Record approved successfully'); invalidate(); },
    onError: (err) => toast.error('Approval failed', getErrorMessage(err)),
  });

  const reject = useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks: string }) =>
      forceMajeureApi.reject(id, remarks),
    onSuccess: () => { toast.success('Record rejected'); invalidate(); },
    onError: (err) => toast.error('Rejection failed', getErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => forceMajeureApi.delete(id),
    onSuccess: () => { toast.success('Force Majeure Claim deleted'); invalidate(); },
    onError: (err) => toast.error('Delete failed', getErrorMessage(err)),
  });

  return { create, update, approve, reject, remove };
};
