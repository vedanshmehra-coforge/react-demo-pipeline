import { apiClient } from '@core/api/api-client';
import type { PaginatedResponse } from '@shared/types/api.types';
import type { TollMaster, CreateTollMasterDto, UpdateTollMasterDto, TollMasterFilterParams } from '../types/toll-master.types';
import { TOLL_MASTER_ENDPOINTS } from './toll-master.endpoints';

export const tollMasterApi = {
  getAll: (params: TollMasterFilterParams) =>
    apiClient.get<PaginatedResponse<TollMaster>>(TOLL_MASTER_ENDPOINTS.BASE, { params }),
  getById: (id: string) =>
    apiClient.get<TollMaster>(TOLL_MASTER_ENDPOINTS.DETAIL(id)),
  create: (dto: CreateTollMasterDto) =>
    apiClient.post<TollMaster>(TOLL_MASTER_ENDPOINTS.BASE, dto),
  update: (id: string, dto: UpdateTollMasterDto) =>
    apiClient.put<TollMaster>(TOLL_MASTER_ENDPOINTS.DETAIL(id), dto),
  approve: (id: string) =>
    apiClient.post<TollMaster>(TOLL_MASTER_ENDPOINTS.APPROVE(id)),
  reject: (id: string, remarks: string) =>
    apiClient.post<TollMaster>(TOLL_MASTER_ENDPOINTS.REJECT(id), { remarks }),
  delete: (id: string) =>
    apiClient.delete<void>(TOLL_MASTER_ENDPOINTS.DETAIL(id)),
};
