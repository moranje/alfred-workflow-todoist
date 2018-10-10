import { CACHE_PATH } from '@/utils/references'
import { files } from '@/workflow/files'
import LRU from 'lru-cache'
import writeJsonFile from 'write-json-file'

const options = {
  max: 500,
  maxAge: 1000 * 60 * 60 * 24 // A day
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
export function serialize(dump: LRU.LRUEntry<{}, {}>[], handleError: any) {
  return writeJsonFile(CACHE_PATH, dump).catch((err: Error) => {
    handleError(err)
  })
}
