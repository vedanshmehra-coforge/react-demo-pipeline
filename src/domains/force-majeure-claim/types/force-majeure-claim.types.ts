import type { BaseEntity, Status } from '@shared/types/common.types';

export type ForceMajeureStatus = Extract<Status, 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED'>;

export interface ForceMajeure extends BaseEntity {
  referenceNo: string;
  title: string;
  status: ForceMajeureStatus;
  description: string | null;
  remarks: string | null;
}

export interface CreateForceMajeureDto {
  title: string;
  description?: string;
}

export interface UpdateForceMajeureDto extends Partial<CreateForceMajeureDto> {
  status?: ForceMajeureStatus;
  remarks?: string;
}

export interface ForceMajeureFilterParams {
  status?: ForceMajeureStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
