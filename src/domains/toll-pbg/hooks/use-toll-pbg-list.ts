import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollPbgApi } from '../api/toll-pbg.api';
import { tollPbgMapper } from '../mappers/toll-pbg.mapper';
import type { TollPbgFilterParams } from '../types/toll-pbg.types';

export const useTollPbgList = (params: TollPbgFilterParams) => {
  return useQuery({
    queryKey: queryKeys.tollPbg.list(params),
    queryFn: async () => {
      const res = await tollPbgApi.getAll(params);
      return {
        ...res.data,
        data: tollPbgMapper.fromApiList(res.data.data),
      };
    },
  });
};
