/* eslint-disable jest/no-hooks */
jest.mock('@/lib/stores/settings-store');
jest.mock('@/lib/stores/cache-store');
jest.mock('@/lib/workflow/notification');

import '@/tests/helpers/nock-requests';

import { spyOnImplementing } from 'jest-mock-process';

import { AlfredError, Errors, funnelError } from '@/lib/error';
import * as notifier from '@/lib/workflow/notification';
import { maybeMockRestore, setUserFacingCall } from '../../tests/helpers/utils';

let stdoutSpy: jest.SpyInstance;
let stderrSpy: jest.SpyInstance;

const notification = spyOnImplementing(
  notifier,
  'notification',
  (...args: any) => args
);

describe('unit: Error management', () => {
  beforeEach(() => {
    stdoutSpy = spyOnImplementing(process.stdout, 'write', () => true);
    stderrSpy = spyOnImplementing(process.stderr, 'write', () => true);
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  afterAll(() => {
    stdoutSpy.mockReset();
    stderrSpy.mockReset();
  });

  /**
   * Unsafe errors.
   */

  it('should show a bug report list item when faced with an unsafe error', () => {
    expect.assertions(1);

    setUserFacingCall(true);
    funnelError(new Error("That's error nr. 1"));

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('subtitle', [
      'Create a bug report',
    ]);
  });

  it('should show a notification with a bug report link when faced with an unsafe error if a list item is not available', () => {
    expect.assertions(1);

    setUserFacingCall(false);
    funnelError(new Error("That's error nr. 2"));

    expect(notification).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Click to create a bug report',
      })
    );
  });

  it('should show an error log when faced with an unsafe error', () => {
    expect.assertions(1);

    setUserFacingCall(true);
    funnelError(new Error("That's error nr. 3"));

    expect(stderrSpy.mock.calls[0][0]).toMatch(/That's error nr. 3/);
  });

  /**
   * Safe errors.
   */

  it('should show a list item describing the problem when faced with a safe error', () => {
    expect.assertions(1);

    setUserFacingCall(true);
    funnelError(
      new AlfredError(Errors.InvalidArgument, "That's error nr. 4", {
        isSafe: true,
      })
    );

    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('subtitle', [
      "That's error nr. 4",
    ]);
  });

  it('should show a notification describing the problem when faced with a safe error if a list item is not available', () => {
    expect.assertions(1);

    setUserFacingCall(false);
    funnelError(
      new AlfredError(Errors.InvalidArgument, "That's error nr. 5", {
        isSafe: true,
      })
    );

    expect(notification).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "That's error nr. 5",
      })
    );
  });

  it('should show an regular log when faced with a safe error', () => {
    expect.assertions(1);

    setUserFacingCall(true);
    funnelError(
      new AlfredError(Errors.InvalidArgument, "That's error nr. 6", {
        isSafe: true,
      })
    );

    expect(stderrSpy.mock.calls[0][0]).toMatch(/That's error nr. 6/);
  });

  it('should not rely on call params', () => {
    expect.assertions(2);

    funnelError(new AlfredError(Errors.InvalidArgument, "That's error nr. 8"));

    expect(stderrSpy.mock.calls[0][0]).toMatch(/That's error nr. 8/);
    expect(stdoutSpy.mock.calls[0][0]).toContainAllAlfredItemsWith('subtitle', [
      'Create a bug report',
    ]);
  });
});
