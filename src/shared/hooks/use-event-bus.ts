import { useEffect } from 'react';
import { eventBus } from '@core/event-bus/event-bus';
import type { DomainEvents } from '@core/event-bus/event-bus';

/**
 * Subscribe to a domain event inside a React component or hook.
 * Automatically unsubscribes on unmount.
 */
export const useEventBus = <K extends keyof DomainEvents>(
  event: K,
  handler: (payload: DomainEvents[K]) => void,
): void => {
  useEffect(() => {
    const unsub = eventBus.on(event, handler);
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
};
