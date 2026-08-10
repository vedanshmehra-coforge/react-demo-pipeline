export const TOLL_NOTIFICATION_ENDPOINTS = {
  BASE: '/toll-notifications',
  DETAIL: (id: string) => `/toll-notifications/${id}`,
  APPROVE: (id: string) => `/toll-notifications/${id}/approve`,
  REJECT: (id: string) => `/toll-notifications/${id}/reject`,
  PUBLISH: (id: string) => `/toll-notifications/${id}/publish`,
} as const;
