import { CACHE_PATH } from '@/utils/references'
import { files } from '@/workflow/files'
import jsonfile from 'jsonfile'
import LRU from 'lru-cache'

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
  return jsonfile.writeFile(CACHE_PATH, dump, (err: Error) => {
    if (err) handleError(err)
  })
}
