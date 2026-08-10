import type { TollRemittance } from '../types/toll-remittance.types';

/** Transform API response to domain model. Add field transforms here as API evolves. */
export const tollRemittanceMapper = {
  fromApi: (raw: TollRemittance): TollRemittance => ({
    ...raw,
    title: raw.title?.trim() ?? '',
    description: raw.description ?? null,
    remarks: raw.remarks ?? null,
  }),

  fromApiList: (items: TollRemittance[]): TollRemittance[] =>
    items.map(tollRemittanceMapper.fromApi),
};
