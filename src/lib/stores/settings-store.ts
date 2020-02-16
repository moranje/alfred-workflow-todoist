import Conf from 'conf';
import { JSONSchema } from 'json-schema-typed';

import { ENV } from '../utils';
import { uuid } from '../workflow';
import { AlfredError, Errors } from '@/lib/error';

export type Settings = {
  token: string;
  language:
    | 'da'
    | 'de'
    | 'en'
    | 'es'
    | 'fi'
    | 'fr'
    | 'it'
    | 'ja'
    | 'ko'
    | 'nl'
    | 'pl'
    | 'pt_BR'
    | 'ru'
    | 'sv'
    | 'tr'
    | 'zh_CN'
    | 'zh_TW';
  max_items: number;
  cache_timeout: number;
  cache_timeout_tasks: number;
  filter_wrapper: string;
  update_checks: number;
  pre_releases: boolean;
  // TODO: replace with `error_tracking`
  anonymous_statistics: boolean;
  log_level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
  last_update: string;
  uuid: string;
};

let instance: Conf<Settings> | null = null;

export const settingsSchema: { [key: string]: JSONSchema } = {
  token: {
    description:
      'Must be a valid todoist token (40 chars and only 0-9 and a-f)',
    type: 'string',
    pattern: '(?:^[0-9a-fA-F]{40}$)|^$',
  },

  language: {
    description:
      'Must be one of: da, de, en, es, fi, fr, it, ja, ko, nl, pl, pt_BR, ru, sv, tr, zh_CN, zh_TW',
    type: 'string',
    enum: [
      'da',
      'de',
      'en',
      'es',
      'fi',
      'fr',
      'it',
      'ja',
      'ko',
      'nl',
      'pl',
      'pt_BR',
      'ru',
      'sv',
      'tr',
      'zh_CN',
      'zh_TW',
    ],
  },

  max_items: {
    description: 'Must be a number between 1 and 20',
    type: 'number',
    minimum: 1,
    maximum: 20,
  },

  cache_timeout: {
    description: 'In seconds. Must be a number between 1 and 31556926 (year)',
    type: 'number',
    minimum: 1,
    maximum: 31556926,
  },

  cache_timeout_tasks: {
    description: 'In seconds. Must be a number between 1 and 31556926 (year)',
    type: 'number',
    minimum: 1,
    maximum: 31556926,
  },

  filter_wrapper: {
    description:
      'Configure the filter string wrapper for tasks, (must be \', " or `)',
    type: 'string',
    pattern: '["\'`]',
    maxLength: 1,
  },

  update_checks: {
    type: 'number',
    description: 'In seconds. Must be a number between 1 and 31556926 (year)',
    minimum: 1,
    maximum: 31556926,
  },

  pre_releases: {
    type: 'boolean',
    description: 'Be notified of alpha and beta releases',
  },

  anonymous_statistics: {
    description: 'Anonymous error tracking',
    type: 'boolean',
  },

  log_level: {
    description: 'The amount of logging output',
    type: 'string',
    enum: ['trace', 'debug', 'info', 'warn', 'error', 'silent'],
  },

  last_update: {
    description: 'The time since last checked for workflow updates',
    type: 'string',
  },

  uuid: {
    description: 'This should be left unchanged',
    type: 'string',
    readOnly: true,
    pattern:
      '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
    format: 'uuid',
  },
};

function createStore(path: string): Conf {
  // @ts-ignore: invalid conf typing
  return new Conf<Settings>({
    configName: 'settings',
    cwd: path,
    schema: settingsSchema,
    defaults: {
      token: '',
      language: 'en',
      max_items: 9,
      cache_timeout: 2629743, // Month in seconds
      cache_timeout_tasks: 604800, // Week in seconds
      filter_wrapper: '"',
      update_checks: 604800, // Week in seconds
      pre_releases: false,
      anonymous_statistics: true,
      log_level: 'error',
      last_update: new Date(2000).toISOString(), // Random date long ago
      uuid: uuid(),
    },
  });
}

/**
 * A store instance to query the settings.json  config file.
 *
 * @param path The path to the configuration file.
 * @returns A `Conf` instance.
 */
export default function settingsStore(
  path: string | undefined = ENV.meta.dataPath
): Conf<Settings> {
  if (!path) {
    throw new AlfredError(
      Errors.InvalidFilePath,
      `Expected a valid settings path, got ${path}`
    );
  }

  if (instance != null) return instance;
  instance = createStore(path);

  return instance;
}
