import type { BaseEntity, Status } from '@shared/types/common.types';

export type TollRemittanceStatus = Extract<Status, 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED'>;

export interface TollRemittance extends BaseEntity {
  referenceNo: string;
  title: string;
  status: TollRemittanceStatus;
  description: string | null;
  remarks: string | null;
}

export interface CreateTollRemittanceDto {
  title: string;
  description?: string;
}

export interface UpdateTollRemittanceDto extends Partial<CreateTollRemittanceDto> {
  status?: TollRemittanceStatus;
  remarks?: string;
}

export interface TollRemittanceFilterParams {
  status?: TollRemittanceStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
