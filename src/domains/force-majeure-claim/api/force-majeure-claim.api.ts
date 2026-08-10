import { apiClient } from '@core/api/api-client';
import type { PaginatedResponse } from '@shared/types/api.types';
import type { ForceMajeure, CreateForceMajeureDto, UpdateForceMajeureDto, ForceMajeureFilterParams } from '../types/force-majeure-claim.types';
import { FORCE_MAJEURE_ENDPOINTS } from './force-majeure-claim.endpoints';

export const forceMajeureApi = {
  getAll: (params: ForceMajeureFilterParams) =>
    apiClient.get<PaginatedResponse<ForceMajeure>>(FORCE_MAJEURE_ENDPOINTS.BASE, { params }),
  getById: (id: string) =>
    apiClient.get<ForceMajeure>(FORCE_MAJEURE_ENDPOINTS.DETAIL(id)),
  create: (dto: CreateForceMajeureDto) =>
    apiClient.post<ForceMajeure>(FORCE_MAJEURE_ENDPOINTS.BASE, dto),
  update: (id: string, dto: UpdateForceMajeureDto) =>
    apiClient.put<ForceMajeure>(FORCE_MAJEURE_ENDPOINTS.DETAIL(id), dto),
  approve: (id: string) =>
    apiClient.post<ForceMajeure>(FORCE_MAJEURE_ENDPOINTS.APPROVE(id)),
  reject: (id: string, remarks: string) =>
    apiClient.post<ForceMajeure>(FORCE_MAJEURE_ENDPOINTS.REJECT(id), { remarks }),
  delete: (id: string) =>
    apiClient.delete<void>(FORCE_MAJEURE_ENDPOINTS.DETAIL(id)),
};
