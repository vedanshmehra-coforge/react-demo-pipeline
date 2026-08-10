import { create } from 'zustand';
import type { TollBidFilterParams } from '../types/toll-bid-management.types';

interface TollBidFiltersStore {
  filters: TollBidFilterParams;
  setFilters: (filters: Partial<TollBidFilterParams>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: TollBidFilterParams = {
  page: 1,
  pageSize: 10,
};

export const useTollBidFiltersStore = create<TollBidFiltersStore>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) =>
    set((s) => ({ filters: { ...s.filters, ...newFilters, page: 1 } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
