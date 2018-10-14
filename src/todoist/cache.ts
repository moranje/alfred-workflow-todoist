import { CACHE_PATH } from '@/utils/references'
import { files } from '@/workflow/files'
import { getSetting } from '@/workflow/settings'
import LRU from 'lru-cache'
import writeJsonFile from 'write-json-file'

// @ts-ignore: don't know how to express this in typescript but this will
// be a number
const cacheTimeout: number = getSetting('cache_timeout')

const options = {
  max: 500,
  maxAge: 1000 * cacheTimeout
}
const cache = LRU(options)
cache.load(files.cache)

/**
 * Pre-loaded disk cache
 */
export { cache }

/**
 * Serialize cache changes back to disk
 *
 * @export
 * @param {LRU.LRUEntry<{}, {}>[]} dump
 * @returns
 */
export function serialize(dump: LRU.LRUEntry<{}, {}>[]) {
  return writeJsonFile(CACHE_PATH, dump)
}
