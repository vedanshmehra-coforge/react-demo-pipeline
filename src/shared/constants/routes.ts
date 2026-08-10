/**
 * Centralised route path constants.
 * All route paths are defined here — never hardcoded in components.
 */
export const ROUTES = {
  // Auth
  AUTH: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },

  // Dashboard
  DASHBOARD: '/dashboard',

  // Toll Master
  TOLL_MASTER: {
    ROOT: '/toll-master',
    LIST: '/toll-master',
    DETAIL: (id: string) => `/toll-master/${id}`,
    CREATE: '/toll-master/create',
    EDIT: (id: string) => `/toll-master/${id}/edit`,
  },

  // Toll Notification
  TOLL_NOTIFICATION: {
    ROOT:      '/toll-notifications',
    LIST:      '/toll-notifications',
    DETAIL:    (id: string) => `/toll-notifications/${id}`,
    CREATE:    '/toll-notifications/create',
    EDIT:      (id: string) => `/toll-notifications/${id}/edit`,
    SO_NUMBER: (id: string) => `/toll-notifications/${id}/so-number`,
  },

  // UFA Empanelment
  UFA_EMPANELMENT: {
    ROOT: '/ufa-empanelment',
    LIST: '/ufa-empanelment',
    DETAIL: (id: string) => `/ufa-empanelment/${id}`,
    CREATE: '/ufa-empanelment/create',
  },

  // UFA Onboarding
  UFA_ONBOARDING: {
    ROOT: '/ufa-onboarding',
    LIST: '/ufa-onboarding',
    DETAIL: (id: string) => `/ufa-onboarding/${id}`,
    CREATE: '/ufa-onboarding/create',
  },

  // Toll Bid Management
  TOLL_BID: {
    ROOT: '/toll-bid',
    LIST: '/toll-bid',
    DETAIL: (id: string) => `/toll-bid/${id}`,
    CREATE: '/toll-bid/create',
  },

  // Force Majeure Claim
  FORCE_MAJEURE: {
    ROOT: '/force-majeure',
    LIST: '/force-majeure',
    DETAIL: (id: string) => `/force-majeure/${id}`,
    CREATE: '/force-majeure/create',
  },

  // Toll Remittance
  TOLL_REMITTANCE: {
    ROOT: '/toll-remittance',
    LIST: '/toll-remittance',
    DETAIL: (id: string) => `/toll-remittance/${id}`,
    CREATE: '/toll-remittance/create',
  },

  // Toll PBG
  TOLL_PBG: {
    ROOT: '/toll-pbg',
    LIST: '/toll-pbg',
    DETAIL: (id: string) => `/toll-pbg/${id}`,
    CREATE: '/toll-pbg/create',
  },

  // Toll Grievance
  TOLL_GRIEVANCE: {
    ROOT: '/toll-grievance',
    LIST: '/toll-grievance',
    DETAIL: (id: string) => `/toll-grievance/${id}`,
    CREATE: '/toll-grievance/create',
  },

  // System
  NOT_FOUND: '/404',
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500',
} as const;
