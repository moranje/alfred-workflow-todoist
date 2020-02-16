/* eslint-disable jest/no-hooks */
jest.mock('@/lib/stores/settings-store');
jest.mock('@sentry/node');

import * as Sentry from '@sentry/node';
import {
  mockProcessStderr,
  mockProcessStdout,
  spyOnImplementing,
} from 'jest-mock-process';

import { AlfredError, Errors } from '@/lib/error';

import { createLogger } from '../logger';
import settingsStore from '../stores/settings-store';
import { setUserFacingCall } from '../../tests/helpers/utils';

let mockStdout: jest.SpyInstance;
let mockStderr: jest.SpyInstance;

describe('unit: Logger', () => {
  beforeEach(() => {
    mockStdout = mockProcessStdout();
    mockStderr = mockProcessStderr();
  });

  afterEach(() => {
    mockStdout.mockRestore();
    mockStderr.mockRestore();
  });

  it('should return the set loglevel', () => {
    expect.assertions(1);

    const logger = createLogger('warn');

    expect(logger.level).toBe('warn');
  });

  it('should not log when set to silent', () => {
    expect.assertions(2);

    const logger = createLogger('silent');
    logger.trace('trace message');
    logger.debug('debug message');
    logger.info('info message');
    logger.warn('warn message');
    logger.error(new Error('error message'));

    expect(mockStdout).not.toHaveBeenCalled();
    expect(mockStderr).not.toHaveBeenCalled();
  });

  it('should return trace, debug, info, warn and error logs when the loglevel is set to trace', () => {
    expect.assertions(2);

    setUserFacingCall(false);
    const logger = createLogger('trace');
    logger.trace('message');
    logger.debug('message');
    logger.info('message');
    logger.warn('message');
    logger.error('message');

    // eslint-disable-next-line jest/prefer-strict-equal
    expect(mockStdout.mock.calls).toEqual([
      [expect.stringContaining('[TRACE] message')],
      ['[DEBUG] message\n'],
      ['[INFO] message\n'],
    ]);
    // eslint-disable-next-line jest/prefer-strict-equal
    expect(mockStderr.mock.calls).toEqual([
      ['[WARN] message\n'],
      ['[ERROR] message\n'],
    ]);
  });

  it('should have made a call to sentry when anonymous_statistics is set to true', () => {
    expect.assertions(2);

    const error = new Error('Houston, we have a problem');
    const alfredError = new AlfredError(
      Errors.InvalidArgument,
      'Houston, we have a problem',
      {
        isSafe: true,
      }
    );
    settingsStore('reset').set('anonymous_statistics', true);
    const logger = createLogger('error');
    logger.error('Sentry error', error, alfredError);

    expect(Sentry.captureException).toHaveBeenCalledWith(error);
    expect(Sentry.captureException).toHaveBeenCalledWith(alfredError);
  });
});
