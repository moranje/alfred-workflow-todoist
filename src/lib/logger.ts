/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Sentry from '@sentry/node';
import cleanStack from 'clean-stack';
import { format } from 'util';

import settingsStore from '@/lib/stores/settings-store';

import { isUserFacingCall } from './cli-args';
import { AlfredError } from './error';
import { init } from './sentry';

type LogStates = 'error' | 'warn' | 'info' | 'debug' | 'trace';
type LogLevel = 'silent' | LogStates;

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

function createOutput(type: LogStates, args: any[]): string {
  // @ts-ignore: chttps://github.com/microsoft/TypeScript/issues/4130
  return `[${type.toUpperCase()}] ${format(...args)}\n`;
}

function createLog(type: LogStates, isStdOut: boolean, args: any[]): void {
  isStdOut
    ? process.stdout.write(createOutput(type, args))
    : process.stderr.write(createOutput(type, args));
}

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
  let sentry: typeof Sentry | null;

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
      if (LEVEL[loglevel.toString()] === LEVEL.trace) {
        // istanbul ignore next: haven't come across a situation where
        // Error.stack is undefined. No way to test this.
        const fullStack = (Error().stack || '').split('\n');
        const stack = fullStack.slice(2).join('\n');

        createLog('trace', !isUserFacingCall(), [
          ...trace,
          `\n\n${cleanStack(stack, { pretty: true })}`,
        ]);
      }
    },

    /*/**
     * Logs any messages with a log level of 'debug' or lower to stdout..
     *
     * @param debug An array of debug messages.
     */
    debug(...debug: any): void {
      if (LEVEL[loglevel.toString()] >= LEVEL.debug) {
        createLog('debug', !isUserFacingCall(), debug);
      }
    },

    /*/**
     * Logs any messages with log level of 'info' or lower to stdout.
     *
     * @param info An array of info messages.
     */
    info(...info: any): void {
      if (LEVEL[loglevel.toString()] >= LEVEL.info) {
        createLog('info', !isUserFacingCall(), info);
      }
    },

    /*/**
     * Logs any messages with log level of 'warn' or lower to stderr.
     *
     * @param warn An array of warnings.
     */
    warn(...warn: any): void {
      if (LEVEL[loglevel.toString()] >= LEVEL.warn) {
        createLog('warn', false, warn);
      }
    },

    /*/**
     * Logs any messages with log level of 'error' or lower to stderr. Also logs
     * the error to sentry if the user allows it.
     *
     * @param error An array of Errors or error messages.
     */
    error(...error: any): void {
      if (LEVEL[loglevel.toString()] >= LEVEL.error) {
        createLog('error', false, error);
      }

      if (sentry === undefined) sentry = init();

      if (sentry != null) {
        error.forEach((err: any) => {
          if (
            (err instanceof Error && !(err instanceof AlfredError)) ||
            (err instanceof AlfredError && err.isSafe !== true)
          ) {
            // @ts-ignore
            sentry.captureException(err);
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
