import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollMasterApi } from '../api/toll-master.api';
import { tollMasterMapper } from '../mappers/toll-master.mapper';
import type { TollMasterFilterParams } from '../types/toll-master.types';

export const useTollMasterList = (params: TollMasterFilterParams) => {
  return useQuery({
    queryKey: queryKeys.tollMaster.list(params),
    queryFn: async () => {
      const res = await tollMasterApi.getAll(params);
      return {
        ...res.data,
        data: tollMasterMapper.fromApiList(res.data.data),
      };
    },
  });
};
