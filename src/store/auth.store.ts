import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { resolvePermissions } from '@core/auth/rbac';
import type { User, Permission } from '@shared/types/auth.types';

interface AuthStore {
  user: User | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  _hydrated: boolean;
  setUser: (user: User) => void;
  clearAuth: () => void;
  _setHydrated: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Start unauthenticated — login page will set the user
      user: null,
      permissions: [],
      isAuthenticated: false,
      _hydrated: false,

      setUser: (user: User) =>
        set({
          user,
          permissions: resolvePermissions(user.role),
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          permissions: [],
          isAuthenticated: false,
        }),

      _setHydrated: () => set({ _hydrated: true }),
    }),
    {
      name: 'nhai-auth-v2',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated();
      },
    },
  ),
);

/** True once Zustand has finished reading from sessionStorage */
export const useAuthHydrated = () => useAuthStore((s) => s._hydrated);
