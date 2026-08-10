import { apiClient } from '@core/api/api-client';
import type { PaginatedResponse } from '@shared/types/api.types';
import type { UfaOnboarding, CreateUfaOnboardingDto, UpdateUfaOnboardingDto, UfaOnboardingFilterParams } from '../types/ufa-onboarding.types';
import { UFA_ONBOARDING_ENDPOINTS } from './ufa-onboarding.endpoints';

export const ufaOnboardingApi = {
  getAll: (params: UfaOnboardingFilterParams) =>
    apiClient.get<PaginatedResponse<UfaOnboarding>>(UFA_ONBOARDING_ENDPOINTS.BASE, { params }),
  getById: (id: string) =>
    apiClient.get<UfaOnboarding>(UFA_ONBOARDING_ENDPOINTS.DETAIL(id)),
  create: (dto: CreateUfaOnboardingDto) =>
    apiClient.post<UfaOnboarding>(UFA_ONBOARDING_ENDPOINTS.BASE, dto),
  update: (id: string, dto: UpdateUfaOnboardingDto) =>
    apiClient.put<UfaOnboarding>(UFA_ONBOARDING_ENDPOINTS.DETAIL(id), dto),
  approve: (id: string) =>
    apiClient.post<UfaOnboarding>(UFA_ONBOARDING_ENDPOINTS.APPROVE(id)),
  reject: (id: string, remarks: string) =>
    apiClient.post<UfaOnboarding>(UFA_ONBOARDING_ENDPOINTS.REJECT(id), { remarks }),
  delete: (id: string) =>
    apiClient.delete<void>(UFA_ONBOARDING_ENDPOINTS.DETAIL(id)),
};
