export const TOLL_PBG_ENDPOINTS = {
  BASE: '/toll-pbg',
  DETAIL: (id: string) => `/toll-pbg/${id}`,
  APPROVE: (id: string) => `/toll-pbg/${id}/approve`,
  REJECT: (id: string) => `/toll-pbg/${id}/reject`,
} as const;
