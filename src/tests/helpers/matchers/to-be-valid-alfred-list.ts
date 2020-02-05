/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from 'chalk';

import {
  assertList,
  isStringOrObject,
  listFromStringOrObject,
} from './helpers';

/**
 * Test to see is  received is valid alfred list.
 *
 * @param received
 * @returns An object with information on whether there was a match or not.
 */
export default function toBeValidAlfredList(
  received: unknown
): { pass: boolean; message: () => string } {
  if (isStringOrObject(received)) {
    try {
      const list = listFromStringOrObject(received);
      assertList(list);

      return {
        pass: true,
        message: (): string => `expected ${list} not to be a valid Alfred list`,
      };
    } catch (error) {
      let message = error.message;

      if (error instanceof SyntaxError) {
        message = `expected string to be a stringified List object, was ${chalk.red(
          received
        )}`;
      }

      return {
        pass: false,
        message: (): string => message,
      };
    }
  }

  return {
    pass: false,
    message: (): string => `expected ${received} to be a valid Alfred list`,
  };
}
