/**
 * A file path reference to settings.json. This is used to store workflow
 * settings.
 *
 * @hidden
 */
export const SETTINGS_PATH = `${
  process.env.HOME
}/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist/settings.json`

/**
 * A file path reference to the cache.json. This is used to store todoist APi
 * call responses.
 *
 * @hidden
 */
export const CACHE_PATH = `${
  process.env.HOME
}/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/com.alfred-workflow-todoist/cache.json`
