export const TOLL_MASTER_ENDPOINTS = {
  BASE: '/toll-master',
  DETAIL: (id: string) => `/toll-master/${id}`,
  APPROVE: (id: string) => `/toll-master/${id}/approve`,
  REJECT: (id: string) => `/toll-master/${id}/reject`,
} as const;
