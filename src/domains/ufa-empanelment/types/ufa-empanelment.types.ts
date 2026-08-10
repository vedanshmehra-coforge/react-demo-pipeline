import type { BaseEntity, Status } from '@shared/types/common.types';

export type UfaEmpanelmentStatus = Extract<Status, 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED'>;

export interface UfaEmpanelment extends BaseEntity {
  referenceNo: string;
  title: string;
  status: UfaEmpanelmentStatus;
  description: string | null;
  remarks: string | null;
  tollMasterId: string;
  agencyName: string;
  agencyCode: string;
}

export interface CreateUfaEmpanelmentDto {
  title: string;
  tollMasterId: string;
  agencyName: string;
  agencyCode: string;
  description?: string;
}

export interface UpdateUfaEmpanelmentDto extends Partial<CreateUfaEmpanelmentDto> {
  status?: UfaEmpanelmentStatus;
  remarks?: string;
}

export interface UfaEmpanelmentFilterParams {
  status?: UfaEmpanelmentStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
