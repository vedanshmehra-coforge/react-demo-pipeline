import { create } from 'zustand';
import type { TollNotificationFilterParams } from '../types/toll-notification.types';

interface TollNotificationFiltersStore {
  filters: TollNotificationFilterParams;
  setFilters: (filters: Partial<TollNotificationFilterParams>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: TollNotificationFilterParams = {
  page:     1,
  pageSize: 10,
};

export const useTollNotificationFiltersStore = create<TollNotificationFiltersStore>((set) => ({
  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) =>
    set((s) => ({ filters: { ...s.filters, ...newFilters, page: 1 } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));
