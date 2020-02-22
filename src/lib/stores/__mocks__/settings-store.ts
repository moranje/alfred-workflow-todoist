const STORE: { [key: string]: string | number | boolean } = {
  token: '0123456789abcde0123456789abcde0123456789',
  language: 'en',
  max_items: 9,
  cache_timeout: 2629743, // Month in seconds
  cache_timeout_tasks: 604800, // Week in seconds
  filter_wrapper: '"',
  update_checks: 604800, // Week in seconds
  pre_releases: false,
  anonymous_statistics: false,
  log_level: 'error',
  last_update: new Date(2000).toISOString(), // Random date long ago
  uuid: 'deadc0de-5cd1-4c84-b2f7-dd6d1b53d44f',
};

const map = new Map();

/**
 * @param action
 */
export default function createStore(
  action: string | undefined
): Map<string, string | boolean | number> {
  if (map.size === 0 || action === 'reset') {
    Object.keys(STORE).forEach((key: string) => map.set(key, STORE[key]));
  }

  // FIXME: not updated, use map.entries to  recreate store
  map.store = STORE;

  return map;
}

export const settingsSchema: { [key: string]: any } = {
  token: {
    description:
      'Must be a valid todoist token (40 chars and only 0-9 and a-f)',
    type: 'string',
    pattern: '(?:^[0-9a-fA-F]{40}$)|^$',
  },

  language: {
    description:
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
    pattern:
      '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
    format: 'uuid',
  },
};
