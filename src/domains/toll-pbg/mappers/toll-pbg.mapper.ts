import type { TollPbg } from '../types/toll-pbg.types';

/** Transform API response to domain model. Add field transforms here as API evolves. */
export const tollPbgMapper = {
  fromApi: (raw: TollPbg): TollPbg => ({
    ...raw,
    title: raw.title?.trim() ?? '',
    description: raw.description ?? null,
    remarks: raw.remarks ?? null,
  }),

  fromApiList: (items: TollPbg[]): TollPbg[] =>
    items.map(tollPbgMapper.fromApi),
};
