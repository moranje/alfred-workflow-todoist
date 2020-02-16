/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'util';

import settingsStore from '@/lib/stores/settings-store';
import { ENV } from '@/lib/utils';

import { AlfredError } from './error';
import { init } from './sentry';

type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface Logger {
  readonly level: LogLevel;
  trace(...trace: any): void;
  debug(...debug: any): void;
  info(...info: any): void;
  warn(...warn: any): void;
  error(...error: any): void;
}

const LEVEL: { [key: string]: number } = {
  trace: 5,
  debug: 4,
  info: 3,
  warn: 2,
  error: 1,
  silent: 0,
};

let instance: Logger | null = null;

/**
 * Exported for testing purposes.
 *
 * @param loglevel The categories of logs allowed to show up.
 * @returns A `Logger` instance.
 */
export function createLogger(loglevel: LogLevel): Logger {
  /**
   * Setup error tracking through Sentry.
   */
  const Sentry = init();

  return {
    get level(): LogLevel {
      return loglevel;
    },

    /**
     * Logs any message with a stack trace to stdout.
     *
     * @param trace An array of trace messages.
     */
    trace(...trace: any): void {
      if (LEVEL[loglevel.toString()] === LEVEL.trace) console.trace(...trace);
    },

    /**
     * Logs any messages with a log level of 'debug' or lower to stdout..
     *
     * @param debug An array of debug messages.
     */
    debug(...debug: any): void {
      if (LEVEL[loglevel.toString()] >= LEVEL.debug) {
        process.stdout.write(format.apply(this, debug) + '\n');
      }
    },

    /**
     * Logs any messages with log level of 'info' or lower to stdout.
     *
     * @param info An array of info messages.
     */
    info(...info: any): void {
      if (LEVEL[loglevel.toString()] >= LEVEL.info) {
        process.stdout.write(format.apply(this, info) + '\n');
      }
    },

    /**
     * Logs any messages with log level of 'warn' or lower to stderr.
     *
     * @param warn An array of warnings.
     */
    warn(...warn: any): void {
      if (LEVEL[loglevel.toString()] >= LEVEL.warn) {
        {
          process.stderr.write(format.apply(this, warn) + '\n');
        }
      }
    },

    /**
     * Logs any messages with log level of 'error' or lower to stderr. Also logs
     * the error to sentry if the user allows it.
     *
     * @param error An array of Errors or error messages.
     */
    error(...error: any): void {
      if (LEVEL[loglevel.toString()] >= LEVEL.error) {
        process.stderr.write(format.apply(this, error) + '\n');
      }

      if (Sentry != null) {
        error.forEach((err: any) => {
          if (
            (err instanceof Error && !(err instanceof AlfredError)) ||
            (err instanceof AlfredError && err.isSafe !== true)
          ) {
            Sentry.captureException(err);
          }
        });
      }
    },
  };
}

/**
 * A simple logger, with an options to store error logs to Sentry.
 *
 * @param logLevel The categories of logs allowed to show up.
 * @returns A `Logger` instance.
 */
export default function logger(logLevel?: LogLevel): Logger {
  if (instance != null) return instance;
  const level = logLevel ?? settingsStore().get('log_level');
  instance = createLogger(level);

  return instance;
}
