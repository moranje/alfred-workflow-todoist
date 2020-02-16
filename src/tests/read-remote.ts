/* eslint-disable jest/no-hooks */
import '@/tests/helpers/nock-requests';

import { mockProcessStdout } from 'jest-mock-process';

import command from '@/lib/command';

jest.mock('@/lib/stores/settings-store');
jest.mock('@/lib/todoist/local-rest-adapter/conf-cache', () => ({
  __esModule: true,
  CacheStore: function CacheStore() {
    return new Map();
  },
}));

let stdoutSpy: jest.SpyInstance;

describe('integration: Read()', () => {
  beforeEach(() => {
    stdoutSpy = mockProcessStdout();
  });

  afterEach(() => {
    stdoutSpy.mockReset();
  });

  it('should query todoist API if the cache is stale or absent', async () => {
    expect.assertions(1);

    await command({ name: 'read', args: '' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'COMPLETE: Project review',
      'COMPLETE: Sign up for dance class',
      'COMPLETE: Get milk',
      'COMPLETE: Plan a thing',
      'COMPLETE: Buy the thing',
      'REFRESH CACHE',
    ]);
  });
});
