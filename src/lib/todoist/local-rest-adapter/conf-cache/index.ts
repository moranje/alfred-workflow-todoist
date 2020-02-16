import Conf, { Options } from 'conf';

import { CacheTimestampStore as timestampStore } from '@/lib/todoist/local-rest-adapter/conf-cache/cache-timestamp-store';

interface CacheStoreOptions<T> extends Options<T> {
  // [key: keyof T]: T[keyof T];
  cacheTimeout: number;
}

interface GetterOptions {
  ignoreCacheTimeout?: boolean;
}

interface SetterOptions {
  cacheTimeout?: number;
}

function serialize<GenericStore>(userStore: GenericStore): string {
  return JSON.stringify(
    Object.assign(userStore, { _cache: timestampStore.store }),
    null,
    '\t'
  );
}

function deserialize<GenericStore>(json: string): GenericStore {
  const stored = JSON.parse(json);

  // Only initialize store the first time running a run
  if (Object.is(timestampStore.store, {})) {
    timestampStore.store = stored._cache;
  }
  delete stored._cache;

  return stored;
}

export class CacheStore<GenericStore = any> extends Conf<GenericStore> {
  /**
   * The time until the cached resources will be refreshed (in
   * milliseconds).
   */
  cacheTimeout: number;
  constructor(options: CacheStoreOptions<GenericStore>) {
    if (!Number.isInteger(options.cacheTimeout) || options.cacheTimeout < 0) {
      throw new TypeError(
        `Expected option cacheTimeout to be a positive number was ${options.cacheTimeout}`
      );
    }

    super(Object.assign(options, { deserialize, serialize }));

    this.cacheTimeout = options.cacheTimeout;
  }

  /**
   * Get a resource from the store.
   *
   * @param key The resource name.
   * @param options IgnoreCacheTimeout: boolean.
   * @returns A resource if not expired an found in cache.
   */
  get<K extends keyof GenericStore>(
    key: K,
    options: GetterOptions = {
      ignoreCacheTimeout: false,
    }
  ): GenericStore[K] {
    if (options?.ignoreCacheTimeout === true) return super.get(key);

    if (this.has(key) === true) {
      return super.get(key);
    }

    // Will return undefined, but now it has the same return signature as Conf
    return super.get(key);
  }

  /**
   * Persist a resource to the store.
   *
   * @param key The resource name.
   * @param value The value to be stored.
   * @param options CacheTimeout: number (in milliseconds). Assign a specific
   * cacheTimeout.
   */
  set<K extends keyof GenericStore>(
    key: K | Partial<GenericStore>,
    value?: GenericStore[K],
    options?: SetterOptions
  ): void {
    timestampStore.setTimestamp(
      // @ts-ignore: https://github.com/microsoft/TypeScript/issues/1863
      key,
      Date.now() + (options?.cacheTimeout || this.cacheTimeout) * 1000
    );

    if (typeof key === 'object') {
      options = value as SetterOptions;
      super.set(key);
    } else if (value !== undefined) {
      super.set(key, value);
    } else {
      throw new Error('Unable to set key-value pair');
    }
  }

  /**
   * Checks whether a resource exists in the store and hasn't expired. If it has, the
   * resource will be deleted from cache.
   *
   * @param key The resource name.
   * @returns True if the the resource exists and hasn't expired.
   */
  has<K extends keyof GenericStore>(key: K): boolean {
    if (this.isExpired(key) === true) {
      super.delete(key);
      timestampStore.deleteTimestamp(key.toString());
      return false;
    }

    return true;
  }

  /**
   * Clear all store cache entries.
   */
  reset(): void {
    super.reset();
    timestampStore.clear();
  }

  /**
   * Checks whether a resource is expired. If so it will be deleted from the
   * store.
   *
   * @param key The resource name.
   * @returns True if the resource is expired.
   */
  isExpired<K extends keyof GenericStore>(key: K): boolean {
    if (!super.has(key)) return true;

    return !timestampStore.has(key.toString());
  }
}
