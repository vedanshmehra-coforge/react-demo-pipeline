import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollRemittanceApi } from '../api/toll-remittance.api';
import { tollRemittanceMapper } from '../mappers/toll-remittance.mapper';

export const useTollRemittanceDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.tollRemittance.detail(id),
    queryFn: async () => {
      const res = await tollRemittanceApi.getById(id);
      return tollRemittanceMapper.fromApi(res.data);
    },
    enabled: !!id,
  });
};
