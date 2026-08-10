import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollBidApi } from '../api/toll-bid-management.api';
import { toast } from '@store/ui.store';
import { getErrorMessage } from '@shared/utils/error';
import type { CreateTollBidDto, UpdateTollBidDto } from '../types/toll-bid-management.types';

export const useTollBidMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.tollBid.all() });

  const create = useMutation({
    mutationFn: (dto: CreateTollBidDto) => tollBidApi.create(dto),
    onSuccess: () => { toast.success('Toll Bid Management created successfully'); invalidate(); },
    onError: (err) => toast.error('Failed to create', getErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTollBidDto }) =>
      tollBidApi.update(id, dto),
    onSuccess: () => { toast.success('Toll Bid Management updated successfully'); invalidate(); },
    onError: (err) => toast.error('Failed to update', getErrorMessage(err)),
  });

  const approve = useMutation({
    mutationFn: (id: string) => tollBidApi.approve(id),
    onSuccess: () => { toast.success('Record approved successfully'); invalidate(); },
    onError: (err) => toast.error('Approval failed', getErrorMessage(err)),
  });

  const reject = useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks: string }) =>
      tollBidApi.reject(id, remarks),
    onSuccess: () => { toast.success('Record rejected'); invalidate(); },
    onError: (err) => toast.error('Rejection failed', getErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => tollBidApi.delete(id),
    onSuccess: () => { toast.success('Toll Bid Management deleted'); invalidate(); },
    onError: (err) => toast.error('Delete failed', getErrorMessage(err)),
  });

  return { create, update, approve, reject, remove };
};
