import { AlfredError, Errors } from '@/lib/error';
import settingsStore from '@/lib/stores/settings-store';
import { ENV } from '@/lib/utils';

import todoist from './local-rest-adapter/index';

export * from './parser';

/**
 * An instantiated `LocalRESTAdapter` object. User settings incorporated.
 */
export const api = todoist(
  settingsStore(ENV.meta.dataPath).get('token'),
  settingsStore(ENV.meta.dataPath).get('cache_timeout'),
  {
    path: ENV.meta.cachePath,
    taskCacheTimeout: settingsStore(ENV.meta.dataPath).get(
      'cache_timeout_tasks'
    ),
  }
);

/**
 * A todoist API request error.
 *
 * @param error Any error.
 * @returns An `AlfredError` instance.
 */
export function requestError(error: Error): AlfredError {
  /* istanbul ignore next */
  return new AlfredError(Errors.TodoistAPIError, error.message, {
    error,
    title: 'The request to the API failed',
    isSafe: true,
  });
}
