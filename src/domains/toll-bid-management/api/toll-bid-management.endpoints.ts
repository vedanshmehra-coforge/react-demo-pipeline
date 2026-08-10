export const TOLL_BID_ENDPOINTS = {
  BASE: '/toll-bid',
  DETAIL: (id: string) => `/toll-bid/${id}`,
  APPROVE: (id: string) => `/toll-bid/${id}/approve`,
  REJECT: (id: string) => `/toll-bid/${id}/reject`,
} as const;
