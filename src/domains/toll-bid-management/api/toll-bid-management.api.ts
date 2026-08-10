import { apiClient } from '@core/api/api-client';
import type { PaginatedResponse } from '@shared/types/api.types';
import type { TollBid, CreateTollBidDto, UpdateTollBidDto, TollBidFilterParams } from '../types/toll-bid-management.types';
import { TOLL_BID_ENDPOINTS } from './toll-bid-management.endpoints';

export const tollBidApi = {
  getAll: (params: TollBidFilterParams) =>
    apiClient.get<PaginatedResponse<TollBid>>(TOLL_BID_ENDPOINTS.BASE, { params }),
  getById: (id: string) =>
    apiClient.get<TollBid>(TOLL_BID_ENDPOINTS.DETAIL(id)),
  create: (dto: CreateTollBidDto) =>
    apiClient.post<TollBid>(TOLL_BID_ENDPOINTS.BASE, dto),
  update: (id: string, dto: UpdateTollBidDto) =>
    apiClient.put<TollBid>(TOLL_BID_ENDPOINTS.DETAIL(id), dto),
  approve: (id: string) =>
    apiClient.post<TollBid>(TOLL_BID_ENDPOINTS.APPROVE(id)),
  reject: (id: string, remarks: string) =>
    apiClient.post<TollBid>(TOLL_BID_ENDPOINTS.REJECT(id), { remarks }),
  delete: (id: string) =>
    apiClient.delete<void>(TOLL_BID_ENDPOINTS.DETAIL(id)),
};
