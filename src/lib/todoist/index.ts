import todoist, { LocalTodoistRESTAPI } from './local-rest-adapter/index';
import { AlfredError, Errors } from '@/lib/error';
import logger from '@/lib/logger';
import settingsStore from '@/lib/stores/settings-store';
import { ENV } from '@/lib/utils';

export * from './parser';
let API: LocalTodoistRESTAPI;

/**
 * An instantiated `LocalRESTAdapter` object. User settings incorporated.
 */
export function getApi(): LocalTodoistRESTAPI {
  if (API) return API;

  try {
    API = todoist(
      settingsStore().get('token'),
      settingsStore().get('cache_timeout'),
      {
        path: ENV.meta.cachePath,
        taskCacheTimeout: settingsStore().get('cache_timeout_tasks'),
      }
    );
  } catch (error) {
    if (error.name === 'InvalidToken') {
      throw new AlfredError(Errors.InvalidArgument, error.message, {
        isSafe: true,
        title: 'You need to set up a valid Todoist API token',
      });
    }

    if (error.name === 'InvalidCacheTimeOut') {
      throw new AlfredError(Errors.InvalidArgument, error.message, {
        isSafe: true,
        title: 'The cache timeout must be set',
      });
    }

    throw error;
  }

  return API;
}

/**
 * A todoist API request error.
 *
 * @param error Any error.
 * @returns An `AlfredError` instance.
 */
export function requestError(error: Error): AlfredError {
  logger().debug('requestError', error);

  /* istanbul ignore next */
  return new AlfredError(Errors.TodoistAPIError, error.message, {
    error,
    title: 'The request to the API failed',
    isSafe: true,
  });
}
