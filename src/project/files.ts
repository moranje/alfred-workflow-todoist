import { CACHE_PATH, SETTINGS_PATH, WORKFLOW_JSON } from '@/project'
import { handleError } from '.'

/** @hidden */
let settings
/** @hidden */
let workflowConfig
/** @hidden */
let cache = []
try {
  settings = require(SETTINGS_PATH)
} catch (err) {
  // Do nothing as user may start with no settings
}

try {
  cache = require(CACHE_PATH)
} catch (err) {
  // Do nothing as no cache be be stored yet
}

try {
  workflowConfig = require(WORKFLOW_JSON)
} catch (error) {
  handleError(error)
}

/**
 * The imported project settings and todoist cache
 *
 * @hidden
 */
export const FILES: project.FILES = {
  settings,
  cache,
  workflowConfig
}
