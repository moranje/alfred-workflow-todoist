import FuzzySearch from 'fuzzy-search';

import settingsStore, {
  Settings,
  settingsSchema,
} from '@/lib/stores/settings-store';

import { createCall } from '../cli-args';
import { AlfredError, Errors } from '../error';
import { Item, List } from '../workflow';

const BETWEEN_SECOND_AND_YEAR =
  'Must be a number between 1 and 31556926 (year)';
const SETTINGS = Object.keys(settingsStore().store);
const ERRORS: { [key: string]: string } = {
  token: 'Should be 40 characters and consist only of hexadecimals',
  language:
    'Must be: da, de, en, es, fi, fr, it, ja, ko, nl, pl, pt_BR, ru, sv, tr, zh_CN or zh_TW',
  max_items: 'Must be a number between 1 and 20',
  cache_timeout: BETWEEN_SECOND_AND_YEAR,
  cache_timeout_tasks: BETWEEN_SECOND_AND_YEAR,
  filter_wrapper: 'Must be either ", \' or `',
  update_checks: BETWEEN_SECOND_AND_YEAR,
  pre_releases: 'Must be either true or false',
  anonymous_statistics: 'Must be either true or false',
  log_level: 'Must be either trace, debug, info, warn, error or silent',
};
const searcher = new FuzzySearch(
  SETTINGS.filter(key => key !== 'uuid' && key !== 'last_update'),
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
  const oldValue = settingsStore().get(key);

  try {
    settingsStore().set(key, typeCastSetting(key, value));
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
    let message = error.message.replace('Config schema violation: ', '');
    if (ERRORS[key.toString()]) message = ERRORS[key.toString()];

    /* istanbul ignore next: validation by ajv, no need to test */
    throw new AlfredError(Errors.InvalidSetting, `${message} (show docs)`, {
      isSafe: true,
      title: `SET(✗): ${key}`,
      error,
    });
  } finally {
    settingsStore().set(key, oldValue);
  }

  return new List(items).write();
}

function getKeys(key: keyof Settings): void {
  const items = searcher.search(`${(key || '').trim()}`).map(
    settingKey =>
      new Item({
        title: `SET: ${settingKey}`,
        subtitle: `Current value: ${settingsStore().get(
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
  const [key, value] = query.trim().split(/ +/);

  if (value != null) return getValue(key as keyof Settings, value);

  return getKeys(key as keyof Settings);
}
