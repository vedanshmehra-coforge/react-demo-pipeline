import '@testing-library/jest-dom';
import { server } from './server';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';

// Start MSW server before all tests, reset handlers after each, close after all
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => {
  server.resetHandlers();
  cleanup(); // unmount React trees after each test
});
afterAll(() => server.close());
