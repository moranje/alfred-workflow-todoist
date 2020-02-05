import FuzzySearch from 'fuzzy-search';

import settingsStore, {
  Settings,
  settingsSchema,
} from '@/lib/stores/settings-store';

import { createCall } from '../cli-args';
import { AlfredError, Errors } from '../error';
import { ENV } from '../utils';
import { Item, List } from '../workflow';

const SETTINGS = Object.keys(settingsStore(ENV.meta.dataPath).store);
const searcher = new FuzzySearch(
  SETTINGS.filter(key => key !== 'uuid'),
  [],
  {
    sort: true,
  }
);

function boolean(value: string): boolean {
  return /^(true|t|yes|y|on|1)$/iu.test(value.trim());
}

function typeCastSetting(
  key: string,
  value: string
): string | boolean | number {
  if (settingsSchema[key.toString()].type === 'boolean') return boolean(value);
  if (settingsSchema[key.toString()].type === 'number') return Number(value);

  return value;
}

function getValue(key: keyof Settings, value: string): void {
  let items: Item[] = [];
  const oldValue = settingsStore(ENV.meta.dataPath).get(key);

  try {
    settingsStore(ENV.meta.dataPath).set(key, typeCastSetting(key, value));
    items = [
      new Item({
        title: `SET(✓): ${key} to ${typeCastSetting(key, value)}`,
        subtitle: `Changing from ${oldValue}`,
        arg: createCall({
          name: 'writeSetting',
          args: {
            key,
            value: typeCastSetting(key, value),
          },
        }),
      }),
    ];
  } catch (error) {
    /* istanbul ignore next: validation by ajv, no need to test */
    throw new AlfredError(
      Errors.InvalidSetting,
      `${error.message.replace('Config schema violation: ', '')} (show docs)`,
      { isSafe: true, title: `SET(✗): ${key}`, error }
    );
  } finally {
    settingsStore(ENV.meta.dataPath).set(key, oldValue);
  }

  return new List(items).write();
}

function getKeys(key: keyof Settings): void {
  const items = searcher.search(`${(key || '').trim()}`).map(
    settingKey =>
      new Item({
        title: `SET: ${settingKey}`,
        subtitle: `Current value: ${settingsStore(ENV.meta.dataPath).get(
          settingKey as keyof Settings
        )}`,
        autocomplete: `${settingKey} `,
        valid: false,
      })
  );

  return new List(items).write();
}

/**
 * Read settings from settings.json.
 *
 * @param query A settings query string.
 */
export async function readSettings(query: string): Promise<void> {
  const [key, value] = query.split(' ');

  if (value != null) return getValue(key as keyof Settings, value);

  return getKeys(key as keyof Settings);
}
