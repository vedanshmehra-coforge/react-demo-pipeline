import { create } from 'zustand';
import type { TollGrievanceFilterParams } from '../types/toll-grievance.types';

interface TollGrievanceFiltersStore {
  filters: TollGrievanceFilterParams;
  setFilters: (filters: Partial<TollGrievanceFilterParams>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: TollGrievanceFilterParams = { page: 1, pageSize: 10 };

export const useTollGrievanceFiltersStore = create<TollGrievanceFiltersStore>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) =>
    set((s) => ({ filters: { ...s.filters, ...newFilters, page: 1 } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
