import chalk from 'chalk';

import { Item, List } from '@/lib/workflow';

import { listFromStringOrObject } from './helpers';
import toBeValidAlfredList from './to-be-valid-alfred-list';

type AlfredProperty =
  | 'uid'
  | 'title'
  | 'subtitle'
  | 'arg'
  | 'type'
  | 'autocomplete'
  | 'match'
  | 'quicklookurl';

const itemProperty: { [key: string]: boolean } = {
  uid: true,
  title: true,
  subtitle: true,
  arg: true,
  type: true,
  autocomplete: true,
  match: true,
  quicklookurl: true,
};

function isValidProperty(property: AlfredProperty): property is AlfredProperty {
  return itemProperty[property];
}

function hasProperty(property: AlfredProperty, item: Item): boolean {
  return typeof item[property] !== 'undefined';
}

/**
 * @param received
 * @param property
 * @param values
 */
export default function toContainAllAlfredItemsWith(
  received: unknown,
  property: AlfredProperty,
  values: string[]
): { pass: boolean; message: () => string } {
  const validList = toBeValidAlfredList(received);
  if (validList.pass === false) return validList;

  if (isValidProperty(property)) {
    const list = listFromStringOrObject(received as string | object) as List;

    const pass: string[] = [];
    const notPass: string[] = [];
    list.items.forEach((item, index) => {
      if (hasProperty(property, item) && item[property] === values[index]) {
        pass.push(
          `expected property ${chalk.italic(
            property
          )} at index ${index} to not to be "${chalk.red(values[index])}"`
        );
      } else {
        if (values[index] === undefined) {
          notPass.push(`did not expect item at index ${chalk.italic(index)}`);
        } else {
          notPass.push(
            `expected property ${chalk.italic(
              property
            )} at index ${index} to be "${chalk.green(
              values[index]
            )}", was "${chalk.red(item[property])}"`
          );
        }
      }
    });

    if (notPass.length === 0) {
      return {
        pass: true,
        message: (): string => pass.join('\n'),
      };
    }

    return {
      pass: false,
      message: (): string => notPass.join('\n'),
    };
  }

  return {
    pass: false,
    message: (): string =>
      `expected property to be one of '${chalk.green('uid')}', '${chalk.green(
        'title'
      )}', '${chalk.green('subtitle')}', '${chalk.green(
        'arg'
      )}', '${chalk.green('type')}', '${chalk.green(
        'autocomplete'
      )}', '${chalk.green('match')}' or '${chalk.green(
        'quicklookurl'
      )}', but was ${chalk.red(property)}`,
  };
}
