import type { UfaEmpanelment } from '../types/ufa-empanelment.types';

export const ufaEmpanelmentMapper = {
  fromApi: (raw: UfaEmpanelment): UfaEmpanelment => ({
    ...raw,
    title: raw.title?.trim() ?? '',
    description: raw.description ?? null,
    remarks: raw.remarks ?? null,
  }),
  fromApiList: (items: UfaEmpanelment[]): UfaEmpanelment[] =>
    items.map(ufaEmpanelmentMapper.fromApi),
};
