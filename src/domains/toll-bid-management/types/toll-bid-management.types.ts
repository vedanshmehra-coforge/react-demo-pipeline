import type { BaseEntity, Status } from '@shared/types/common.types';

export type TollBidStatus = Extract<Status, 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED'>;

export interface TollBid extends BaseEntity {
  referenceNo: string;
  title: string;
  status: TollBidStatus;
  description: string | null;
  remarks: string | null;
}

export interface CreateTollBidDto {
  title: string;
  description?: string;
}

export interface UpdateTollBidDto extends Partial<CreateTollBidDto> {
  status?: TollBidStatus;
  remarks?: string;
}

export interface TollBidFilterParams {
  status?: TollBidStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
