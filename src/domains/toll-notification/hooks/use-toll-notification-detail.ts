import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/query-keys';
import { tollNotificationMockStore } from '../mock/toll-notification.mock';

export const useTollNotificationDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.tollNotification.detail(id),
    queryFn: () => {
      const record = tollNotificationMockStore.getById(id);
      if (!record) throw new Error('Notification not found');
      return Promise.resolve(record);
    },
    enabled: !!id,
    staleTime: 0,
  });
};
