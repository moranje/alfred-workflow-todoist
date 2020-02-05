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

let mockStdout: jest.SpyInstance;
let mockStderr: jest.SpyInstance;
let mockTrace: jest.SpyInstance;

describe('unit: Logger', () => {
  beforeEach(() => {
    mockStdout = mockProcessStdout();
    mockStderr = mockProcessStderr();
    mockTrace = spyOnImplementing(console, 'trace', () => true);
  });

  afterEach(() => {
    mockStdout.mockRestore();
    mockStderr.mockRestore();
    mockTrace.mockRestore();
  });

  it('should return the set loglevel', () => {
    expect.assertions(1);

    const logger = createLogger('warn');

    expect(logger.level).toBe('warn');
  });

  it('should not log when set to silent', () => {
    expect.assertions(3);

    const logger = createLogger('silent');
    logger.trace('trace message');
    logger.debug('debug message');
    logger.info('info message');
    logger.warn('warn message');
    logger.error(new Error('error message'));

    expect(mockStdout).not.toHaveBeenCalled();
    expect(mockStderr).not.toHaveBeenCalled();
    expect(mockTrace).not.toHaveBeenCalled();
  });

  it('should return trace, debug, info, warn and error logs when the loglevel is set to trace', () => {
    expect.assertions(3);

    const logger = createLogger('trace');
    logger.trace('trace message');
    logger.debug('debug message');
    logger.info('info message');
    logger.warn('warn message');
    logger.error('error message');

    // eslint-disable-next-line jest/prefer-strict-equal
    expect(mockStdout.mock.calls).toEqual([
      ['debug message\n'],
      ['info message\n'],
    ]);
    // eslint-disable-next-line jest/prefer-strict-equal
    expect(mockStderr.mock.calls).toEqual([
      ['warn message\n'],
      ['error message\n'],
    ]);
    expect(mockTrace).toHaveBeenCalledWith('trace message');
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
