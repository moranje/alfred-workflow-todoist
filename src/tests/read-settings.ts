/* eslint-disable jest/no-hooks */
import dotenv from 'dotenv';
import { mockProcessStderr, mockProcessStdout } from 'jest-mock-process';

import command from '@/lib/command';

dotenv.config();

jest.mock('@/lib/stores/settings-store');
jest.mock('@/lib/todoist/local-rest-adapter/conf-cache');

let stdoutSpy: jest.SpyInstance;
let stderrSpy: jest.SpyInstance;

describe('integration: Read Settings()', () => {
  beforeEach(() => {
    stdoutSpy = mockProcessStdout();
    stderrSpy = mockProcessStderr();
  });

  it('should list all possible settings', async () => {
    expect.assertions(1);
    await command({ name: 'readSettings', args: '' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'SET: token',
      'SET: language',
      'SET: max_items',
      'SET: cache_timeout',
      'SET: cache_timeout_tasks',
      'SET: filter_wrapper',
      'SET: update_checks',
      'SET: pre_releases',
      'SET: anonymous_statistics',
      'SET: log_level',
    ]);
  });

  it('should filter setting keys', async () => {
    expect.assertions(1);
    await command({ name: 'readSettings', args: 'to' });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'SET: token',
      'SET: cache_timeout',
      'SET: cache_timeout_tasks',
    ]);
  });

  it('should provide a hint for valid string setting value', async () => {
    expect.assertions(1);
    await command({
      name: 'readSettings',
      args: 'max_items 41',
    });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'SET(✓): max_items to 41',
    ]);
  });

  it('should provide a hint for valid number setting value', async () => {
    expect.assertions(1);
    await command({
      name: 'readSettings',
      args: 'token 1234567890abcdef1234567890abcdef12345678',
    });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'SET(✓): token to 1234567890abcdef1234567890abcdef12345678',
    ]);
  });

  it('should provide a hint for valid boolean setting value', async () => {
    expect.assertions(1);
    await command({
      name: 'readSettings',
      args: 'pre_releases 1',
    });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      'SET(✓): pre_releases to true',
    ]);
  });

  it('should provide a hint for invalid setting', async () => {
    expect.assertions(1);
    await command({
      name: 'readSettings',
      args: 'make_me_coffee',
    });

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('title', [
      "Sorry, I've got nothing to show you",
    ]);
  });
});
