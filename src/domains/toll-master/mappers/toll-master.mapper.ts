import type { TollMaster } from '../types/toll-master.types';

/** Transform API response to domain model. Add field transforms here as API evolves. */
export const tollMasterMapper = {
  fromApi: (raw: TollMaster): TollMaster => ({
    ...raw,
    title: raw.title?.trim() ?? '',
    description: raw.description ?? null,
    remarks: raw.remarks ?? null,
  }),

  fromApiList: (items: TollMaster[]): TollMaster[] =>
    items.map(tollMasterMapper.fromApi),
};
