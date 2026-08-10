import type { TollGrievance } from '../types/toll-grievance.types';

export const tollGrievanceMapper = {
  fromApi: (raw: TollGrievance): TollGrievance => ({
    ...raw,
    title: raw.title?.trim() ?? '',
    description: raw.description ?? null,
    remarks: raw.remarks ?? null,
  }),
  fromApiList: (items: TollGrievance[]): TollGrievance[] =>
    items.map(tollGrievanceMapper.fromApi),
};
