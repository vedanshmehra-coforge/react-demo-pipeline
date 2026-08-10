/**
 * Typed pub/sub event bus for cross-domain communication.
 * Domains NEVER import each other — they communicate through events.
 *
 * Usage:
 *   eventBus.emit('toll-master:created', { tollMasterId: '123' });
 *   const unsub = eventBus.on('toll-master:created', ({ tollMasterId }) => { ... });
 *   unsub(); // cleanup in useEffect return
 */

export type DomainEvents = {
  // Toll Master
  'toll-master:created': { tollMasterId: string };
  'toll-master:updated': { tollMasterId: string };
  // UFA Empanelment
  'empanelment:approved': { empanelmentId: string; tollMasterId: string };
  'empanelment:rejected': { empanelmentId: string };
  // UFA Onboarding
  'onboarding:completed': { onboardingId: string; empanelmentId: string };
  // Toll Bid Management
  'bid:awarded': { bidId: string };
  'bid:cancelled': { bidId: string };
  // Force Majeure
  'force-majeure:submitted': { claimId: string };
  'force-majeure:approved': { claimId: string };
  // Remittance
  'remittance:submitted': { remittanceId: string };
  'remittance:approved': { remittanceId: string };
  // Toll PBG
  'pbg:submitted': { pbgId: string };
  // Notification
  'notification:status-changed': { notificationId: string; status: string };
  // Grievance
  'grievance:submitted': { grievanceId: string };
  'grievance:resolved': { grievanceId: string };
  // Auth
  'auth:logout': Record<string, never>;
  'auth:session-expired': Record<string, never>;
};

type EventHandler<T> = (payload: T) => void;

function createEventBus<TEvents extends Record<string, unknown>>() {
  const listeners = new Map<keyof TEvents, Set<EventHandler<unknown>>>();

  return {
    on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): () => void {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(handler as EventHandler<unknown>);
      return () => {
        listeners.get(event)?.delete(handler as EventHandler<unknown>);
      };
    },

    emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
      listeners.get(event)?.forEach((handler) => handler(payload));
    },

    off<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void {
      listeners.get(event)?.delete(handler as EventHandler<unknown>);
    },
  };
}

export const eventBus = createEventBus<DomainEvents>();
