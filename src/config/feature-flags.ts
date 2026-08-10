/**
 * Feature flags — toggle features without deploying.
 * In production these would come from a remote config service.
 */
export const featureFlags = {
  enableFastag: false,
  enableFinance: false,
  enableAnalytics: false,
  enableAuditTrail: true,
  enableQueryDevtools: import.meta.env.VITE_APP_ENV !== 'production',
} as const;

export type FeatureFlag = keyof typeof featureFlags;
