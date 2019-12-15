/**
 * A file path reference to settings.json. This is used to store workflow
 * settings.
 *
 * @hidden
 */
export const SETTINGS_PATH = `${process.env.HOME}/Library/Application Support/Alfred 3/Workflow Data/com.alfred-workflow-todoist/settings.json`;

/**
 * A file path reference to the cache.json. This is used to store todoist APi
 * call responses.
 *
 * @hidden
 */
export const CACHE_PATH = `${process.env.HOME}/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/com.alfred-workflow-todoist/cache.json`;

/**
 * A file path reference to package.josn.
 *
 * @hidden
 */
export const WORKFLOW_PATH = process.cwd();

/**
 * A file path reference to package.josn.
 *
 * @hidden
 */
export const WORKFLOW_JSON = `${WORKFLOW_PATH}/workflow.json`;

/**
 * A file path reference to package.josn.
 *
 * @hidden
 */
export const NOTIFIER_PATH = `${WORKFLOW_PATH}/notifier/terminal-notifier.app/Contents/MacOS/terminal-notifier`;

/**
 * The API base path.
 */
export const TODOIST_API_URI = 'https://api.todoist.com/rest/v1';
