import { tollNotificationHandlers } from './toll-notification.handlers';
import { authHandlers } from './auth.handlers';

/** All MSW request handlers. Add new domain handlers here. */
export const handlers = [
  ...authHandlers,
  ...tollNotificationHandlers,
];
