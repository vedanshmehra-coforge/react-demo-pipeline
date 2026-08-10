import { apiClient } from '@core/api/api-client';
import type { PaginatedResponse } from '@shared/types/api.types';
import type { TollPbg, CreateTollPbgDto, UpdateTollPbgDto, TollPbgFilterParams } from '../types/toll-pbg.types';
import { TOLL_PBG_ENDPOINTS } from './toll-pbg.endpoints';

export const tollPbgApi = {
  getAll: (params: TollPbgFilterParams) =>
    apiClient.get<PaginatedResponse<TollPbg>>(TOLL_PBG_ENDPOINTS.BASE, { params }),
  getById: (id: string) =>
    apiClient.get<TollPbg>(TOLL_PBG_ENDPOINTS.DETAIL(id)),
  create: (dto: CreateTollPbgDto) =>
    apiClient.post<TollPbg>(TOLL_PBG_ENDPOINTS.BASE, dto),
  update: (id: string, dto: UpdateTollPbgDto) =>
    apiClient.put<TollPbg>(TOLL_PBG_ENDPOINTS.DETAIL(id), dto),
  approve: (id: string) =>
    apiClient.post<TollPbg>(TOLL_PBG_ENDPOINTS.APPROVE(id)),
  reject: (id: string, remarks: string) =>
    apiClient.post<TollPbg>(TOLL_PBG_ENDPOINTS.REJECT(id), { remarks }),
  delete: (id: string) =>
    apiClient.delete<void>(TOLL_PBG_ENDPOINTS.DETAIL(id)),
};
