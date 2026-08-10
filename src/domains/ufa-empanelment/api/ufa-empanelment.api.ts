import { apiClient } from '@core/api/api-client';
import type { PaginatedResponse } from '@shared/types/api.types';
import type { UfaEmpanelment, CreateUfaEmpanelmentDto, UpdateUfaEmpanelmentDto, UfaEmpanelmentFilterParams } from '../types/ufa-empanelment.types';
import { UFA_EMPANELMENT_ENDPOINTS } from './ufa-empanelment.endpoints';

export const ufaEmpanelmentApi = {
  getAll: (params: UfaEmpanelmentFilterParams) =>
    apiClient.get<PaginatedResponse<UfaEmpanelment>>(UFA_EMPANELMENT_ENDPOINTS.BASE, { params }),
  getById: (id: string) =>
    apiClient.get<UfaEmpanelment>(UFA_EMPANELMENT_ENDPOINTS.DETAIL(id)),
  create: (dto: CreateUfaEmpanelmentDto) =>
    apiClient.post<UfaEmpanelment>(UFA_EMPANELMENT_ENDPOINTS.BASE, dto),
  update: (id: string, dto: UpdateUfaEmpanelmentDto) =>
    apiClient.put<UfaEmpanelment>(UFA_EMPANELMENT_ENDPOINTS.DETAIL(id), dto),
  approve: (id: string) =>
    apiClient.post<UfaEmpanelment>(UFA_EMPANELMENT_ENDPOINTS.APPROVE(id)),
  reject: (id: string, remarks: string) =>
    apiClient.post<UfaEmpanelment>(UFA_EMPANELMENT_ENDPOINTS.REJECT(id), { remarks }),
  delete: (id: string) =>
    apiClient.delete<void>(UFA_EMPANELMENT_ENDPOINTS.DETAIL(id)),
};
