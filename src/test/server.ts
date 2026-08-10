import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW server instance used across all tests.
 * Import this in vitest.setup.ts — do NOT use in browser.
 */
export const server = setupServer(...handlers);
