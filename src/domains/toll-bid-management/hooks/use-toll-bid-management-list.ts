import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollBidApi } from '../api/toll-bid-management.api';
import { tollBidMapper } from '../mappers/toll-bid-management.mapper';
import type { TollBidFilterParams } from '../types/toll-bid-management.types';

export const useTollBidList = (params: TollBidFilterParams) => {
  return useQuery({
    queryKey: queryKeys.tollBid.list(params),
    queryFn: async () => {
      const res = await tollBidApi.getAll(params);
      return {
        ...res.data,
        data: tollBidMapper.fromApiList(res.data.data),
      };
    },
  });
};
