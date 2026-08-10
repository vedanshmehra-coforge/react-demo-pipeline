import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface UiStore {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  // Global loading overlay
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

let toastId = 0;

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      // Theme
      theme: 'light',
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

      // Toasts
      toasts: [],
      addToast: (toast) =>
        set((s) => ({
          toasts: [
            ...s.toasts,
            { ...toast, id: String(++toastId) },
          ],
        })),
      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      // Global loading
      isGlobalLoading: false,
      setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),
    }),
    {
      name: 'nhai-ui',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist layout preferences, not transient state
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    },
  ),
);

// Convenience helpers (call outside React without hooks)
export const toast = {
  success: (title: string, description?: string) =>
    useUiStore.getState().addToast({ title, description, variant: 'success' }),
  error: (title: string, description?: string) =>
    useUiStore.getState().addToast({ title, description, variant: 'error' }),
  warning: (title: string, description?: string) =>
    useUiStore.getState().addToast({ title, description, variant: 'warning' }),
  info: (title: string, description?: string) =>
    useUiStore.getState().addToast({ title, description, variant: 'info' }),
};
