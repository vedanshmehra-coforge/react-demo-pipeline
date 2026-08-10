import type { BaseEntity, Status } from '@shared/types/common.types';

export type TollMasterStatus = Extract<Status, 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED'>;

export interface TollMaster extends BaseEntity {
  referenceNo: string;
  title: string;
  status: TollMasterStatus;
  description: string | null;
  remarks: string | null;
}

export interface CreateTollMasterDto {
  title: string;
  description?: string;
}

export interface UpdateTollMasterDto extends Partial<CreateTollMasterDto> {
  status?: TollMasterStatus;
  remarks?: string;
}

export interface TollMasterFilterParams {
  status?: TollMasterStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
