import { apiClient } from '@core/api/api-client';
import type { PaginatedResponse } from '@shared/types/api.types';
import type { TollRemittance, CreateTollRemittanceDto, UpdateTollRemittanceDto, TollRemittanceFilterParams } from '../types/toll-remittance.types';
import { TOLL_REMITTANCE_ENDPOINTS } from './toll-remittance.endpoints';

export const tollRemittanceApi = {
  getAll: (params: TollRemittanceFilterParams) =>
    apiClient.get<PaginatedResponse<TollRemittance>>(TOLL_REMITTANCE_ENDPOINTS.BASE, { params }),
  getById: (id: string) =>
    apiClient.get<TollRemittance>(TOLL_REMITTANCE_ENDPOINTS.DETAIL(id)),
  create: (dto: CreateTollRemittanceDto) =>
    apiClient.post<TollRemittance>(TOLL_REMITTANCE_ENDPOINTS.BASE, dto),
  update: (id: string, dto: UpdateTollRemittanceDto) =>
    apiClient.put<TollRemittance>(TOLL_REMITTANCE_ENDPOINTS.DETAIL(id), dto),
  approve: (id: string) =>
    apiClient.post<TollRemittance>(TOLL_REMITTANCE_ENDPOINTS.APPROVE(id)),
  reject: (id: string, remarks: string) =>
    apiClient.post<TollRemittance>(TOLL_REMITTANCE_ENDPOINTS.REJECT(id), { remarks }),
  delete: (id: string) =>
    apiClient.delete<void>(TOLL_REMITTANCE_ENDPOINTS.DETAIL(id)),
};
