import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { ufaOnboardingApi } from '../api/ufa-onboarding.api';
import { toast } from '@store/ui.store';
import { getErrorMessage } from '@shared/utils/error';
import type { CreateUfaOnboardingDto, UpdateUfaOnboardingDto } from '../types/ufa-onboarding.types';

export const useUfaOnboardingMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.ufaOnboarding.all() });

  const create = useMutation({
    mutationFn: (dto: CreateUfaOnboardingDto) => ufaOnboardingApi.create(dto),
    onSuccess: () => { toast.success('UFA Onboarding created successfully'); invalidate(); },
    onError: (err) => toast.error('Failed to create', getErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUfaOnboardingDto }) =>
      ufaOnboardingApi.update(id, dto),
    onSuccess: () => { toast.success('UFA Onboarding updated successfully'); invalidate(); },
    onError: (err) => toast.error('Failed to update', getErrorMessage(err)),
  });

  const approve = useMutation({
    mutationFn: (id: string) => ufaOnboardingApi.approve(id),
    onSuccess: () => { toast.success('Record approved successfully'); invalidate(); },
    onError: (err) => toast.error('Approval failed', getErrorMessage(err)),
  });

  const reject = useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks: string }) =>
      ufaOnboardingApi.reject(id, remarks),
    onSuccess: () => { toast.success('Record rejected'); invalidate(); },
    onError: (err) => toast.error('Rejection failed', getErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => ufaOnboardingApi.delete(id),
    onSuccess: () => { toast.success('UFA Onboarding deleted'); invalidate(); },
    onError: (err) => toast.error('Delete failed', getErrorMessage(err)),
  });

  return { create, update, approve, reject, remove };
};
