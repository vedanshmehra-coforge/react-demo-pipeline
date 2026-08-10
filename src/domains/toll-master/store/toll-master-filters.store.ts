import { create } from 'zustand';
import type { TollMasterFilterParams } from '../types/toll-master.types';

interface TollMasterFiltersStore {
  filters: TollMasterFilterParams;
  setFilters: (filters: Partial<TollMasterFilterParams>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: TollMasterFilterParams = {
  page: 1,
  pageSize: 10,
};

export const useTollMasterFiltersStore = create<TollMasterFiltersStore>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) =>
    set((s) => ({ filters: { ...s.filters, ...newFilters, page: 1 } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
