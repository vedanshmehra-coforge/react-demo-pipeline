export const TOLL_GRIEVANCE_ENDPOINTS = {
  BASE: '/toll-grievance',
  DETAIL: (id: string) => `/toll-grievance/${id}`,
  APPROVE: (id: string) => `/toll-grievance/${id}/approve`,
  REJECT: (id: string) => `/toll-grievance/${id}/reject`,
} as const;
