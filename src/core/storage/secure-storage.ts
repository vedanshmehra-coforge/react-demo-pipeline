/**
 * Secure storage abstraction.
 * Sensitive data (tokens) must NOT be stored here — use token.service.ts (memory).
 * This is for non-sensitive persisted preferences: theme, locale, last-visited route.
 */

type StorageKey = 'theme' | 'locale' | 'sidebar-collapsed' | 'last-route';

export const secureStorage = {
  get<T>(key: StorageKey): T | null {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: StorageKey, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage quota exceeded or unavailable — fail silently
    }
  },

  remove(key: StorageKey): void {
    sessionStorage.removeItem(key);
  },

  clear(): void {
    sessionStorage.clear();
  },
};
