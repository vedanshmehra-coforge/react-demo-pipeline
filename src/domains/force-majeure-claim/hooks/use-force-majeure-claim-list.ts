import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { forceMajeureApi } from '../api/force-majeure-claim.api';
import { forceMajeureMapper } from '../mappers/force-majeure-claim.mapper';
import type { ForceMajeureFilterParams } from '../types/force-majeure-claim.types';

export const useForceMajeureList = (params: ForceMajeureFilterParams) => {
  return useQuery({
    queryKey: queryKeys.forceMajeure.list(params),
    queryFn: async () => {
      const res = await forceMajeureApi.getAll(params);
      return {
        ...res.data,
        data: forceMajeureMapper.fromApiList(res.data.data),
      };
    },
  });
};
