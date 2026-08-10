/**
 * Token service — stores access token in memory (never in localStorage/sessionStorage)
 * to prevent XSS token theft. Refresh token is managed server-side via HttpOnly cookie.
 */

let _accessToken: string | null = null;

export const tokenService = {
  set(token: string): void {
    _accessToken = token;
  },
  get(): string | null {
    return _accessToken;
  },
  clear(): void {
    _accessToken = null;
  },
  isSet(): boolean {
    return _accessToken !== null;
  },
};
