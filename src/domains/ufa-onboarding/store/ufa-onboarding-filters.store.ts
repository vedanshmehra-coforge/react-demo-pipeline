import { create } from 'zustand';
import type { UfaOnboardingFilterParams } from '../types/ufa-onboarding.types';

interface UfaOnboardingFiltersStore {
  filters: UfaOnboardingFilterParams;
  setFilters: (filters: Partial<UfaOnboardingFilterParams>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: UfaOnboardingFilterParams = { page: 1, pageSize: 10 };

export const useUfaOnboardingFiltersStore = create<UfaOnboardingFiltersStore>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) =>
    set((s) => ({ filters: { ...s.filters, ...newFilters, page: 1 } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
