import type { BaseEntity, Status } from '@shared/types/common.types';

export type TollPbgStatus = Extract<Status, 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED'>;

export interface TollPbg extends BaseEntity {
  referenceNo: string;
  title: string;
  status: TollPbgStatus;
  description: string | null;
  remarks: string | null;
}

export interface CreateTollPbgDto {
  title: string;
  description?: string;
}

export interface UpdateTollPbgDto extends Partial<CreateTollPbgDto> {
  status?: TollPbgStatus;
  remarks?: string;
}

export interface TollPbgFilterParams {
  status?: TollPbgStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
