import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollPbgApi } from '../api/toll-pbg.api';
import { tollPbgMapper } from '../mappers/toll-pbg.mapper';

export const useTollPbgDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.tollPbg.detail(id),
    queryFn: async () => {
      const res = await tollPbgApi.getById(id);
      return tollPbgMapper.fromApi(res.data);
    },
    enabled: !!id,
  });
};
