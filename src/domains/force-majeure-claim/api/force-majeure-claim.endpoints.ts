export const FORCE_MAJEURE_ENDPOINTS = {
  BASE: '/force-majeure',
  DETAIL: (id: string) => `/force-majeure/${id}`,
  APPROVE: (id: string) => `/force-majeure/${id}/approve`,
  REJECT: (id: string) => `/force-majeure/${id}/reject`,
} as const;
