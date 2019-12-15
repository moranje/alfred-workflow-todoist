import macOsVersion from 'macos-version';
import Conf from 'conf';
import CacheConf from 'cache-conf';
import { JSONSchema } from 'json-schema-typed';

interface SettingsSchema extends JSONSchema {
  explanation: string;
}

const getEnv = (key: string): string | undefined =>
  process.env[`alfred_${key}`];
const schema: { [key: string]: SettingsSchema } = {
  token: {
    description: 'A todoist API token',
    explanation:
      'Must be a valid todoist token (40 chars and only 0-9 and a-f)',
    type: 'string',
    pattern: '(?:^[0-9a-fA-F]{40}$)|^$',
  },

  language: {
    description: 'A todoist language',
    explanation:
      'Must be one of: en, da, pl, zh, ko, de, pt, ja, it, fr, sv, ru, es, nl',
    type: 'string',
    enum: [
      'en',
      'da',
      'pl',
      'zh',
      'ko',
      'de',
      'pt',
      'ja',
      'it',
      'fr',
      'sv',
      'ru',
      'es',
      'nl',
    ],
  },

  max_items: {
    description: 'The number of list items shown',
    explanation: 'Must be a number between 1 and 20',
    type: 'number',
    minimum: 1,
    maximum: 20,
  },

  cache_timeout: {
    description: 'Time until next cache refresh (seconds)',
    explanation: 'Must be a number between 1 and 604800',
    type: 'number',
    minimum: 1,
    maximum: 604800,
  },

  auto_update: {
    description: 'Auto update workflow',
    explanation: 'Can either be true of false',
    type: 'boolean',
  },

  uuid: {
    description: 'A unique identifier',
    explanation: 'This should be left unchanged',
    type: 'string',
    pattern:
      '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
    format: 'uuid',
  },

  anonymous_statistics: {
    description: 'Usage information',
    explanation: 'Can either be true of false',
    type: 'boolean',
  },
};

const meta = {
  osx: macOsVersion(),
  nodejs: process.version,
  alfred: getEnv('version'),
  dataPath: getEnv('workflow_data'),
  cachePath: getEnv('workflow_cache'),
};

const workflow = {
  version: getEnv('workflow_version'),
  uid: getEnv('workflow_uid'),
  bundleId: getEnv('workflow_bundleid'),
  workflowPath: process.cwd(),
};

export const ENV = {
  meta,
  workflow,
};

export const config = new Conf({
  configName: 'settings.json',
  cwd: meta.dataPath,
  schema,
});

export const cache = new CacheConf({
  configName: 'cache.json',
  cwd: meta.cachePath,
  version: workflow.version,
  maxAge: config.get('cache_timeout'),
});
