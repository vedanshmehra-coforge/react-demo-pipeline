import { create } from 'zustand';
import type { TollPbgFilterParams } from '../types/toll-pbg.types';

interface TollPbgFiltersStore {
  filters: TollPbgFilterParams;
  setFilters: (filters: Partial<TollPbgFilterParams>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: TollPbgFilterParams = {
  page: 1,
  pageSize: 10,
};

export const useTollPbgFiltersStore = create<TollPbgFiltersStore>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) =>
    set((s) => ({ filters: { ...s.filters, ...newFilters, page: 1 } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
