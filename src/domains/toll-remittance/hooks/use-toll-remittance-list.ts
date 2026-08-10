import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollRemittanceApi } from '../api/toll-remittance.api';
import { tollRemittanceMapper } from '../mappers/toll-remittance.mapper';
import type { TollRemittanceFilterParams } from '../types/toll-remittance.types';

export const useTollRemittanceList = (params: TollRemittanceFilterParams) => {
  return useQuery({
    queryKey: queryKeys.tollRemittance.list(params),
    queryFn: async () => {
      const res = await tollRemittanceApi.getAll(params);
      return {
        ...res.data,
        data: tollRemittanceMapper.fromApiList(res.data.data),
      };
    },
  });
};
