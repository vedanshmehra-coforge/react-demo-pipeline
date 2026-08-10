import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollGrievanceApi } from '../api/toll-grievance.api';
import { tollGrievanceMapper } from '../mappers/toll-grievance.mapper';
import type { TollGrievanceFilterParams } from '../types/toll-grievance.types';

export const useTollGrievanceList = (params: TollGrievanceFilterParams) => {
  return useQuery({
    queryKey: queryKeys.tollGrievance.list(params),
    queryFn: async () => {
      const res = await tollGrievanceApi.getAll(params);
      return {
        ...res.data,
        data: tollGrievanceMapper.fromApiList(res.data.data),
      };
    },
  });
};
