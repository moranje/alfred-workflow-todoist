import { AlfredError, Errors } from '../error';
import { Store } from '../todoist/local-rest-adapter';
import settingsStore from './settings-store';
import { CacheStore } from '@/lib/todoist/local-rest-adapter/conf-cache';

let instance: CacheStore<Store> | null = null;

function createStore(path: string): CacheStore<Store> {
  process.stdout.write('cacheStore' + path + '\n');
  return new CacheStore<Store>({
    configName: 'cache',
    cwd: path,
    cacheTimeout: settingsStore().get('cache_timeout') as number,
  });
}

/**
 * A store instance to query the settings.json  config file.
 *
 * @param path The path to the configuration file.
 * @returns A `Conf` instance.
 */
export default function cacheStore(
  path: string | undefined
): CacheStore<Store> {
  if (!path) {
    throw new AlfredError(
      Errors.InvalidFilePath,
      `Expected a valid cache path, got ${path}`
    );
  }

  if (instance != null) return instance;
  instance = createStore(path);

  return instance;
}
