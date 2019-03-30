import { CACHE_PATH, SETTINGS_PATH, WORKFLOW_JSON } from '@/project'

/** @hidden */
let settings
/** @hidden */
let workflowConfig
/** @hidden */
let cache = []
try {
  settings = require(SETTINGS_PATH)
  cache = require(CACHE_PATH)
  workflowConfig = require(WORKFLOW_JSON)
} catch (err) {
  // Do nothing
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
