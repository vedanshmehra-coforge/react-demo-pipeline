import type { TollBid } from '../types/toll-bid-management.types';

/** Transform API response to domain model. Add field transforms here as API evolves. */
export const tollBidMapper = {
  fromApi: (raw: TollBid): TollBid => ({
    ...raw,
    title: raw.title?.trim() ?? '',
    description: raw.description ?? null,
    remarks: raw.remarks ?? null,
  }),

  fromApiList: (items: TollBid[]): TollBid[] =>
    items.map(tollBidMapper.fromApi),
};
