/**
 * Centralised TanStack Query key factory.
 * Using factory functions ensures consistent key structure and
 * makes targeted invalidation straightforward.
 */
export const queryKeys = {
  // Auth
  auth: {
    me: () => ['auth', 'me'] as const,
  },

  // Toll Master
  tollMaster: {
    all: () => ['toll-master'] as const,
    lists: () => [...queryKeys.tollMaster.all(), 'list'] as const,
    list: (params: object) => [...queryKeys.tollMaster.lists(), params] as const,
    details: () => [...queryKeys.tollMaster.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.tollMaster.details(), id] as const,
  },

  // Toll Notification
  tollNotification: {
    all: () => ['toll-notification'] as const,
    lists: () => [...queryKeys.tollNotification.all(), 'list'] as const,
    list: (params: object) => [...queryKeys.tollNotification.lists(), params] as const,
    details: () => [...queryKeys.tollNotification.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.tollNotification.details(), id] as const,
  },

  // UFA Empanelment
  ufaEmpanelment: {
    all: () => ['ufa-empanelment'] as const,
    lists: () => [...queryKeys.ufaEmpanelment.all(), 'list'] as const,
    list: (params: object) => [...queryKeys.ufaEmpanelment.lists(), params] as const,
    details: () => [...queryKeys.ufaEmpanelment.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.ufaEmpanelment.details(), id] as const,
  },

  // UFA Onboarding
  ufaOnboarding: {
    all: () => ['ufa-onboarding'] as const,
    lists: () => [...queryKeys.ufaOnboarding.all(), 'list'] as const,
    list: (params: object) => [...queryKeys.ufaOnboarding.lists(), params] as const,
    details: () => [...queryKeys.ufaOnboarding.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.ufaOnboarding.details(), id] as const,
  },

  // Toll Bid Management
  tollBid: {
    all: () => ['toll-bid'] as const,
    lists: () => [...queryKeys.tollBid.all(), 'list'] as const,
    list: (params: object) => [...queryKeys.tollBid.lists(), params] as const,
    details: () => [...queryKeys.tollBid.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.tollBid.details(), id] as const,
  },

  // Force Majeure
  forceMajeure: {
    all: () => ['force-majeure'] as const,
    lists: () => [...queryKeys.forceMajeure.all(), 'list'] as const,
    list: (params: object) => [...queryKeys.forceMajeure.lists(), params] as const,
    details: () => [...queryKeys.forceMajeure.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.forceMajeure.details(), id] as const,
  },

  // Toll Remittance
  tollRemittance: {
    all: () => ['toll-remittance'] as const,
    lists: () => [...queryKeys.tollRemittance.all(), 'list'] as const,
    list: (params: object) => [...queryKeys.tollRemittance.lists(), params] as const,
    details: () => [...queryKeys.tollRemittance.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.tollRemittance.details(), id] as const,
  },

  // Toll PBG
  tollPbg: {
    all: () => ['toll-pbg'] as const,
    lists: () => [...queryKeys.tollPbg.all(), 'list'] as const,
    list: (params: object) => [...queryKeys.tollPbg.lists(), params] as const,
    details: () => [...queryKeys.tollPbg.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.tollPbg.details(), id] as const,
  },

  // Toll Grievance
  tollGrievance: {
    all: () => ['toll-grievance'] as const,
    lists: () => [...queryKeys.tollGrievance.all(), 'list'] as const,
    list: (params: object) => [...queryKeys.tollGrievance.lists(), params] as const,
    details: () => [...queryKeys.tollGrievance.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.tollGrievance.details(), id] as const,
  },
} as const;
