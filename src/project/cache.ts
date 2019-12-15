import { AlfredError, CACHE_PATH, FILES, getSetting } from '@/project';
import remove from 'lodash.remove';
import LRUCache from 'lru-cache';
import writeJsonFile from 'write-json-file';
import { Task, Project, Label } from '@/todoist';

export type StoreKey = string;
export type StoreValue = Task[] | Project[] | Label[];
export type StoreItem = Task | Project | Label;

/** @hidden */
const MILLISECONDS = 1000;
/** Time in seconds */
const cacheTimeout = getSetting('cache_timeout') as number;

/** @hidden */
const options: LRUCache.Options<StoreKey, StoreValue> = {
  max: 500,
  maxAge: MILLISECONDS * cacheTimeout,
};
/** @hidden */
const cache = new LRUCache(options);
cache.load(FILES.cache);

/**
 * Pre-loaded disk cache
 */
export { cache };

/**
 * Remove an object at a specific key in cache by id.
 */
export function removeStoreValue(type: string, id: number): void {
  const objects: ArrayLike<StoreItem> = (cache.get(type) as StoreValue) || [];
  const removed = remove(objects, obj => obj.id === id);

  if (!removed) {
    throw new AlfredError(`Could not remove item with id ${id} from ${type}`);
  }
}

/**
 * Serialize cache changes back to disk
 */
export async function serialize(
  dump: LRUCache.Entry<StoreKey, StoreValue>[]
): Promise<void> {
  return writeJsonFile(CACHE_PATH, dump);
}
