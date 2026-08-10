import type { BaseEntity, Status } from '@shared/types/common.types';

export type UfaOnboardingStatus = Extract<Status, 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED'>;

export interface UfaOnboarding extends BaseEntity {
  referenceNo: string;
  title: string;
  status: UfaOnboardingStatus;
  description: string | null;
  remarks: string | null;
  empanelmentId: string;
  agencyName: string;
}

export interface CreateUfaOnboardingDto {
  title: string;
  empanelmentId: string;
  agencyName: string;
  description?: string;
}

export interface UpdateUfaOnboardingDto extends Partial<CreateUfaOnboardingDto> {
  status?: UfaOnboardingStatus;
  remarks?: string;
}

export interface UfaOnboardingFilterParams {
  status?: UfaOnboardingStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
