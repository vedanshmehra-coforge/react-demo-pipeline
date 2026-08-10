import type { BaseEntity, Status } from '@shared/types/common.types';

export type TollGrievanceStatus = Extract<Status, 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED'>;

export interface TollGrievance extends BaseEntity {
  referenceNo: string;
  title: string;
  status: TollGrievanceStatus;
  description: string | null;
  remarks: string | null;
}

export interface CreateTollGrievanceDto {
  title: string;
  description?: string;
}

export interface UpdateTollGrievanceDto extends Partial<CreateTollGrievanceDto> {
  status?: TollGrievanceStatus;
  remarks?: string;
}

export interface TollGrievanceFilterParams {
  status?: TollGrievanceStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
