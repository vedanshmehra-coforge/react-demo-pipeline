import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollNotificationMockStore } from '../mock/toll-notification.mock';
import type { TollNotificationFilterParams } from '../types/toll-notification.types';

export const useTollNotificationList = (params: TollNotificationFilterParams) => {
  return useQuery({
    queryKey: queryKeys.tollNotification.list(params),
    queryFn: () => {
      // Simulate tiny async delay to show loading states during dev
      return Promise.resolve(tollNotificationMockStore.getAll(params));
    },
    staleTime: 0,   // always refetch to see mutations immediately
  });
};
