import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { ufaEmpanelmentApi } from '../api/ufa-empanelment.api';
import { ufaEmpanelmentMapper } from '../mappers/ufa-empanelment.mapper';
import type { UfaEmpanelmentFilterParams } from '../types/ufa-empanelment.types';

export const useUfaEmpanelmentList = (params: UfaEmpanelmentFilterParams) => {
  return useQuery({
    queryKey: queryKeys.ufaEmpanelment.list(params),
    queryFn: async () => {
      const res = await ufaEmpanelmentApi.getAll(params);
      return {
        ...res.data,
        data: ufaEmpanelmentMapper.fromApiList(res.data.data),
      };
    },
  });
};
