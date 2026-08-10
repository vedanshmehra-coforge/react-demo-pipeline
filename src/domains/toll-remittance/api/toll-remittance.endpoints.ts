export const TOLL_REMITTANCE_ENDPOINTS = {
  BASE: '/toll-remittance',
  DETAIL: (id: string) => `/toll-remittance/${id}`,
  APPROVE: (id: string) => `/toll-remittance/${id}/approve`,
  REJECT: (id: string) => `/toll-remittance/${id}/reject`,
} as const;
