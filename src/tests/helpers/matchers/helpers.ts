/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from 'chalk';

import { Item, List } from '@/lib/workflow';

const itemProperty: { [key: string]: boolean } = {
  uid: true,
  title: true,
  subtitle: true,
  icon: true,
  arg: true,
  type: true,
  valid: true,
  autocomplete: true,
  match: true,
  mod: true,
  text: true,
  quicklookurl: true,
};

const itemType: { [key: string]: string } = {
  uid: 'string',
  title: 'string',
  subtitle: 'string',
  icon: 'object',
  arg: 'string',
  type: 'string',
  valid: 'boolean',
  autocomplete: 'string',
  match: 'string',
  mod: 'object',
  text: 'object',
  quicklookurl: 'string',
};

/**
 * @param item
 */
export function assertItem(item: any): asserts item is Item {
  if (!item.title) {
    throw new Error(`expected '${chalk.italic('title')}' property on ${item}`);
  }

  Object.keys(item).forEach(key => {
    if (!itemProperty[key]) {
      throw new Error(`did not expect property ${chalk.red(key)} on ${item}`);
    }

    if (typeof item[key] !== itemType[key]) {
      throw new Error(
        `expected property ${chalk.italic(
          key
        )} on ${item} to be of type ${chalk.green(
          itemType[key]
        )} was ${chalk.red(typeof item[key])}`
      );
    }
  });
}

/**
 * @param list
 */
export function assertList(list: any): asserts list is List {
  if (!list.items) {
    throw new Error(`expected '${chalk.italic('items')}' property on ${list}`);
  }

  if (!Array.isArray(list.items)) {
    throw new Error(
      `expected '${chalk.italic('items')}' property to be an ${chalk.green(
        'array'
      )}, was ${chalk.red(list.items)} (${chalk.red(typeof list.items)})`
    );
  }

  list.items.forEach((item: any) => assertItem(item));
}

/**
 * @param input
 */
export function isStringOrObject(input: any): input is string | object {
  if (typeof input === 'string') return true;

  if (typeof input === 'object' && !Array.isArray(input) && input != null) {
    return true;
  }

  return false;
}

/**
 * @param list
 */
export function listFromStringOrObject(list: string | object): object {
  if (typeof list === 'string') {
    return JSON.parse(list);
  }

  return list;
}
