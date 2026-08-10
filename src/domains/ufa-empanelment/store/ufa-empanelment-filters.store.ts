import { create } from 'zustand';
import type { UfaEmpanelmentFilterParams } from '../types/ufa-empanelment.types';

interface UfaEmpanelmentFiltersStore {
  filters: UfaEmpanelmentFilterParams;
  setFilters: (filters: Partial<UfaEmpanelmentFilterParams>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: UfaEmpanelmentFilterParams = { page: 1, pageSize: 10 };

export const useUfaEmpanelmentFiltersStore = create<UfaEmpanelmentFiltersStore>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) =>
    set((s) => ({ filters: { ...s.filters, ...newFilters, page: 1 } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
