import chalk from 'chalk';

import { List } from '@/lib/workflow';

import { listFromStringOrObject } from './helpers';
import toBeValidAlfredList from './to-be-valid-alfred-list';

/**
 * @param received
 * @param length
 */
export default function toBeAlfredListOfLength(
  received: unknown,
  length: number
): { pass: boolean; message: () => string } {
  const validList = toBeValidAlfredList(received);
  if (validList.pass === false) return validList;

  const list = listFromStringOrObject(received as string | object) as List;
  if (list.items.length === length) {
    return {
      pass: true,
      message: (): string =>
        `expected list not to have ${chalk.red(length)} items`,
    };
  }

  return {
    pass: false,
    message: (): string =>
      `expected list to have ${chalk.green(length)} items, found ${chalk.red(
        list.items.length
      )}`,
  };
}
