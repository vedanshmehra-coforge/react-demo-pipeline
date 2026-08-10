import { create } from 'zustand';
import type { TollRemittanceFilterParams } from '../types/toll-remittance.types';

interface TollRemittanceFiltersStore {
  filters: TollRemittanceFilterParams;
  setFilters: (filters: Partial<TollRemittanceFilterParams>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: TollRemittanceFilterParams = {
  page: 1,
  pageSize: 10,
};

export const useTollRemittanceFiltersStore = create<TollRemittanceFiltersStore>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) =>
    set((s) => ({ filters: { ...s.filters, ...newFilters, page: 1 } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
