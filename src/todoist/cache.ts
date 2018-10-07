import { AlfredError } from '@/workflow/error'
import { Notification } from '@/workflow/notifier'
import { existsSync } from 'fs'
import jsonfile from 'jsonfile'
import LRU from 'lru-cache'

const path = `${
  process.env.HOME
}/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/com.alfred-workflow-todoist/cache.json`
const options = {
  max: 500
  // maxAge: 1000 * 60 * 60 * 24
  // length: (n: string) => n.length
}
const cache = LRU(options)

// Pre-load cache
let cacheEntries = []
if (existsSync(path)) {
  try {
    cacheEntries = jsonfile.readFileSync(path)
  } catch {
    // Do nothing
  }
}
cache.load(cacheEntries)

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
  return (
    jsonfile
      .writeFile(path, dump)
      // @ts-ignore not in declaration file
      .then((response: any) => {
        return response
      })
      .catch((err: Error) => {
        return Notification(new AlfredError(err.message, err.name, err.stack)).write()
      })
  )
}
