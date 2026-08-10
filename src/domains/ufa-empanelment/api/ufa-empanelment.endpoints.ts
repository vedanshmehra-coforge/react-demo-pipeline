export const UFA_EMPANELMENT_ENDPOINTS = {
  BASE: '/ufa-empanelment',
  DETAIL: (id: string) => `/ufa-empanelment/${id}`,
  APPROVE: (id: string) => `/ufa-empanelment/${id}/approve`,
  REJECT: (id: string) => `/ufa-empanelment/${id}/reject`,
} as const;
