import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { ufaOnboardingApi } from '../api/ufa-onboarding.api';
import { ufaOnboardingMapper } from '../mappers/ufa-onboarding.mapper';
import type { UfaOnboardingFilterParams } from '../types/ufa-onboarding.types';

export const useUfaOnboardingList = (params: UfaOnboardingFilterParams) => {
  return useQuery({
    queryKey: queryKeys.ufaOnboarding.list(params),
    queryFn: async () => {
      const res = await ufaOnboardingApi.getAll(params);
      return {
        ...res.data,
        data: ufaOnboardingMapper.fromApiList(res.data.data),
      };
    },
  });
};
