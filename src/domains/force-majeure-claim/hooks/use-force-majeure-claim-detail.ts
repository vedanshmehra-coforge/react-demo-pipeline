import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { forceMajeureApi } from '../api/force-majeure-claim.api';
import { forceMajeureMapper } from '../mappers/force-majeure-claim.mapper';

export const useForceMajeureDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.forceMajeure.detail(id),
    queryFn: async () => {
      const res = await forceMajeureApi.getById(id);
      return forceMajeureMapper.fromApi(res.data);
    },
    enabled: !!id,
  });
};
