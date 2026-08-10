import type { ForceMajeure } from '../types/force-majeure-claim.types';

/** Transform API response to domain model. Add field transforms here as API evolves. */
export const forceMajeureMapper = {
  fromApi: (raw: ForceMajeure): ForceMajeure => ({
    ...raw,
    title: raw.title?.trim() ?? '',
    description: raw.description ?? null,
    remarks: raw.remarks ?? null,
  }),

  fromApiList: (items: ForceMajeure[]): ForceMajeure[] =>
    items.map(forceMajeureMapper.fromApi),
};
