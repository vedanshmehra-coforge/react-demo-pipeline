export const UFA_ONBOARDING_ENDPOINTS = {
  BASE: '/ufa-onboarding',
  DETAIL: (id: string) => `/ufa-onboarding/${id}`,
  APPROVE: (id: string) => `/ufa-onboarding/${id}/approve`,
  REJECT: (id: string) => `/ufa-onboarding/${id}/reject`,
} as const;
