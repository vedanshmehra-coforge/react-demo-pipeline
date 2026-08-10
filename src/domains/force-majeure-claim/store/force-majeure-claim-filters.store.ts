import { create } from 'zustand';
import type { ForceMajeureFilterParams } from '../types/force-majeure-claim.types';

interface ForceMajeureFiltersStore {
  filters: ForceMajeureFilterParams;
  setFilters: (filters: Partial<ForceMajeureFilterParams>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: ForceMajeureFilterParams = {
  page: 1,
  pageSize: 10,
};

export const useForceMajeureFiltersStore = create<ForceMajeureFiltersStore>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) =>
    set((s) => ({ filters: { ...s.filters, ...newFilters, page: 1 } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
