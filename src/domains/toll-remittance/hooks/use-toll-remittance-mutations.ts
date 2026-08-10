import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollRemittanceApi } from '../api/toll-remittance.api';
import { toast } from '@store/ui.store';
import { getErrorMessage } from '@shared/utils/error';
import type { CreateTollRemittanceDto, UpdateTollRemittanceDto } from '../types/toll-remittance.types';

export const useTollRemittanceMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.tollRemittance.all() });

  const create = useMutation({
    mutationFn: (dto: CreateTollRemittanceDto) => tollRemittanceApi.create(dto),
    onSuccess: () => { toast.success('Toll Remittance created successfully'); invalidate(); },
    onError: (err) => toast.error('Failed to create', getErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTollRemittanceDto }) =>
      tollRemittanceApi.update(id, dto),
    onSuccess: () => { toast.success('Toll Remittance updated successfully'); invalidate(); },
    onError: (err) => toast.error('Failed to update', getErrorMessage(err)),
  });

  const approve = useMutation({
    mutationFn: (id: string) => tollRemittanceApi.approve(id),
    onSuccess: () => { toast.success('Record approved successfully'); invalidate(); },
    onError: (err) => toast.error('Approval failed', getErrorMessage(err)),
  });

  const reject = useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks: string }) =>
      tollRemittanceApi.reject(id, remarks),
    onSuccess: () => { toast.success('Record rejected'); invalidate(); },
    onError: (err) => toast.error('Rejection failed', getErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => tollRemittanceApi.delete(id),
    onSuccess: () => { toast.success('Toll Remittance deleted'); invalidate(); },
    onError: (err) => toast.error('Delete failed', getErrorMessage(err)),
  });

  return { create, update, approve, reject, remove };
};
