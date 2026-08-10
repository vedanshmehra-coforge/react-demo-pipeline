import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollMasterApi } from '../api/toll-master.api';
import { tollMasterMapper } from '../mappers/toll-master.mapper';

export const useTollMasterDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.tollMaster.detail(id),
    queryFn: async () => {
      const res = await tollMasterApi.getById(id);
      return tollMasterMapper.fromApi(res.data);
    },
    enabled: !!id,
  });
};
