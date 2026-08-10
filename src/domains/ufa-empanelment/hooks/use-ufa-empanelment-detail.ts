import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { ufaEmpanelmentApi } from '../api/ufa-empanelment.api';
import { ufaEmpanelmentMapper } from '../mappers/ufa-empanelment.mapper';

export const useUfaEmpanelmentDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.ufaEmpanelment.detail(id),
    queryFn: async () => {
      const res = await ufaEmpanelmentApi.getById(id);
      return ufaEmpanelmentMapper.fromApi(res.data);
    },
    enabled: !!id,
  });
};
