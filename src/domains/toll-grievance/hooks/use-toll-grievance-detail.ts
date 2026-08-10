import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollGrievanceApi } from '../api/toll-grievance.api';
import { tollGrievanceMapper } from '../mappers/toll-grievance.mapper';

export const useTollGrievanceDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.tollGrievance.detail(id),
    queryFn: async () => {
      const res = await tollGrievanceApi.getById(id);
      return tollGrievanceMapper.fromApi(res.data);
    },
    enabled: !!id,
  });
};
