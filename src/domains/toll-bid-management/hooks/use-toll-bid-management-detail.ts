import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollBidApi } from '../api/toll-bid-management.api';
import { tollBidMapper } from '../mappers/toll-bid-management.mapper';

export const useTollBidDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.tollBid.detail(id),
    queryFn: async () => {
      const res = await tollBidApi.getById(id);
      return tollBidMapper.fromApi(res.data);
    },
    enabled: !!id,
  });
};
