import { apiClient } from '@core/api/api-client';
import type { PaginatedResponse } from '@shared/types/api.types';
import type { TollGrievance, CreateTollGrievanceDto, UpdateTollGrievanceDto, TollGrievanceFilterParams } from '../types/toll-grievance.types';
import { TOLL_GRIEVANCE_ENDPOINTS } from './toll-grievance.endpoints';

export const tollGrievanceApi = {
  getAll: (params: TollGrievanceFilterParams) =>
    apiClient.get<PaginatedResponse<TollGrievance>>(TOLL_GRIEVANCE_ENDPOINTS.BASE, { params }),
  getById: (id: string) =>
    apiClient.get<TollGrievance>(TOLL_GRIEVANCE_ENDPOINTS.DETAIL(id)),
  create: (dto: CreateTollGrievanceDto) =>
    apiClient.post<TollGrievance>(TOLL_GRIEVANCE_ENDPOINTS.BASE, dto),
  update: (id: string, dto: UpdateTollGrievanceDto) =>
    apiClient.put<TollGrievance>(TOLL_GRIEVANCE_ENDPOINTS.DETAIL(id), dto),
  approve: (id: string) =>
    apiClient.post<TollGrievance>(TOLL_GRIEVANCE_ENDPOINTS.APPROVE(id)),
  reject: (id: string, remarks: string) =>
    apiClient.post<TollGrievance>(TOLL_GRIEVANCE_ENDPOINTS.REJECT(id), { remarks }),
  delete: (id: string) =>
    apiClient.delete<void>(TOLL_GRIEVANCE_ENDPOINTS.DETAIL(id)),
};
