import { CacheStore } from '@/lib/todoist/local-rest-adapter/conf-cache';

import LocalRESTAdapter from './local-rest-adapter';
import LocalTaskAdapter from './local-task-adapter';
import { Store } from './types';
// Export types
export * from 'todoist-rest-api';
export * from './types';
export { LocalRESTAdapter };
export { LocalTaskAdapter };

interface Options {
  fileName?: string;
  path?: string;
  taskCacheTimeout?: number;
}

interface LocalTodoistRESTAPI {
  [key: string]: LocalTodoistRESTAPIV1;
  v1: LocalTodoistRESTAPIV1;
}

interface LocalTodoistRESTAPIV1 {
  [key: string]:
    | LocalTaskAdapter<'task'>
    | LocalRESTAdapter<'project'>
    | LocalRESTAdapter<'label'>
    | LocalRESTAdapter<'comment'>
    | LocalRESTAdapter<'section'>;
  task: LocalTaskAdapter<'task'>;
  project: LocalRESTAdapter<'project'>;
  label: LocalRESTAdapter<'label'>;
  comment: LocalRESTAdapter<'comment'>;
  section: LocalRESTAdapter<'section'>;
}

/**
 * An adapter for todoist REST API with a cache.
 *
 * @param apiKey A Todoist API key, see your [preferences](https://todoist.com/prefs/integrations).
 * @param cacheTimeout The time until the cached resources will be refreshed (in
 * milliseconds).
 * @param options An options object, all of these are optional. Allows setting a
 * cache `path` on disk. It allows a setting a `filename`.json. Also (since
 * `tasks` are bound to change more than `projects`, `labels`, `sections` or
 * `comments`) a `taskCacheTimeout` can be set to refresh task cache more
 * frequently.
 * @returns  A REST api object with preinstantiated resource adapters.
 */
export default function todoist(
  apiKey: string,
  cacheTimeout: number,
  { fileName, path, taskCacheTimeout }: Options = {
    fileName: 'cache',
    path: '',
  }
): LocalTodoistRESTAPI {
  if (!/^[0-9A-Fa-f]{40}$/.test(apiKey)) {
    throw new Error(
      `Invalid API token. A token should be 40 characters long and exist of hexadecimals, was ${apiKey} (${apiKey.length} characters)`
    );
  }

  if (typeof cacheTimeout !== 'number' && cacheTimeout < 0) {
    throw new Error(
      `A cache timeout must be set and must not be a negative number`
    );
  }

  const store = new CacheStore<Store>({
    configName: fileName || 'cache',
    cwd: path,
    cacheTimeout: cacheTimeout || 1,
  });
  let taskStore = store;
  if (typeof taskCacheTimeout === 'number') {
    taskStore = new CacheStore<Store>({
      configName: fileName || 'cache',
      cwd: path,
      cacheTimeout: taskCacheTimeout,
    });
  }

  return {
    v1: {
      task: new LocalTaskAdapter('task', apiKey, taskStore),
      project: new LocalRESTAdapter('project', apiKey, store),
      label: new LocalRESTAdapter('label', apiKey, store),
      comment: new LocalRESTAdapter('comment', apiKey, store),
      section: new LocalRESTAdapter('section', apiKey, store),
    },
  };
}
