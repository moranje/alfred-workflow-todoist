import { CACHE_PATH, SETTINGS_PATH } from '@/project';

/** @hidden */
let settings
/** @hidden */
let cache = []
try {
  settings = require(SETTINGS_PATH)
  cache = require(CACHE_PATH)
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
  cache
}
