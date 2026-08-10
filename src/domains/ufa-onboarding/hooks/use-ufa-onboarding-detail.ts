import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { ufaOnboardingApi } from '../api/ufa-onboarding.api';
import { ufaOnboardingMapper } from '../mappers/ufa-onboarding.mapper';

export const useUfaOnboardingDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.ufaOnboarding.detail(id),
    queryFn: async () => {
      const res = await ufaOnboardingApi.getById(id);
      return ufaOnboardingMapper.fromApi(res.data);
    },
    enabled: !!id,
  });
};
