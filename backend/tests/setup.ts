import { beforeAll, afterAll, beforeEach, vi } from 'vitest';

beforeAll(async () => {
  // Setup environment for testing
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'test-access-secret';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
});

beforeEach(async () => {
  vi.clearAllMocks();
});

afterAll(async () => {
  // Cleanup
});
