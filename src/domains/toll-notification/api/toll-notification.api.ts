import { apiClient } from '@core/api/api-client';
import type { PaginatedResponse } from '@shared/types/api.types';
import type {
  TollNotification,
  CreateTollNotificationDto,
  UpdateTollNotificationDto,
  TollNotificationFilterParams,
} from '../types/toll-notification.types';
import { TOLL_NOTIFICATION_ENDPOINTS } from './toll-notification.endpoints';

export const tollNotificationApi = {
  getAll: (params: TollNotificationFilterParams) =>
    apiClient.get<PaginatedResponse<TollNotification>>(TOLL_NOTIFICATION_ENDPOINTS.BASE, { params }),
  getById: (id: string) =>
    apiClient.get<TollNotification>(TOLL_NOTIFICATION_ENDPOINTS.DETAIL(id)),
  create: (dto: CreateTollNotificationDto) =>
    apiClient.post<TollNotification>(TOLL_NOTIFICATION_ENDPOINTS.BASE, dto),
  update: (id: string, dto: UpdateTollNotificationDto) =>
    apiClient.put<TollNotification>(TOLL_NOTIFICATION_ENDPOINTS.DETAIL(id), dto),
  approve: (id: string) =>
    apiClient.post<TollNotification>(TOLL_NOTIFICATION_ENDPOINTS.APPROVE(id)),
  reject: (id: string, remarks: string) =>
    apiClient.post<TollNotification>(TOLL_NOTIFICATION_ENDPOINTS.REJECT(id), { remarks }),
  publish: (id: string) =>
    apiClient.post<TollNotification>(TOLL_NOTIFICATION_ENDPOINTS.PUBLISH(id)),
  delete: (id: string) =>
    apiClient.delete<void>(TOLL_NOTIFICATION_ENDPOINTS.DETAIL(id)),
};
